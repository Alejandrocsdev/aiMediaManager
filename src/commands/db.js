const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const { rgb, isVideo } = require('../utils');

const db = (mode) => {
  const root = process.cwd();

  const videoDir = path.join(root, 'video');
  const dbDir = path.join(root, 'db');

  const linePath = path.join(root, 'line.json');
  const zonePath = path.join(root, 'zone.json');
  const rtspPath = path.join(root, 'rtsp.json');
  const generalPath = path.join(root, 'general.json');

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }

  const general = JSON.parse(fs.readFileSync(generalPath, 'utf8'));

  const [type, source] = mode.split(':');

  let sourceList = [];

  // FILE MODE → generate DB for each video
  if (source === 'file') {
    if (!fs.existsSync(videoDir)) {
      throw new Error('❌ video folder not found');
    }

    const files = fs.readdirSync(videoDir);

    for (const file of files) {
      const full = path.join(videoDir, file);
      if (fs.statSync(full).isFile() && isVideo(full)) {
        sourceList.push({
          type: 'file',
          path: full,
          name: path.parse(file).name,
        });
      }
    }

    if (!sourceList.length) {
      throw new Error('❌ No valid video files found');
    }
  }

  // RTSP MODE → single DB for RTSP stream
  else if (source === 'rtsp') {
    if (!fs.existsSync(rtspPath)) {
      throw new Error('❌ rtsp.json not found');
    }

    const rtsp = JSON.parse(fs.readFileSync(rtspPath, 'utf8'));

    sourceList.push({
      type: 'rtsp',
      path: rtsp,
      name: 'rtsp',
    });
  } else {
    throw new Error('❌ Invalid source mode');
  }

  // CREATE DB FILES
  for (const src of sourceList) {
    let algorithm;

    // LINE
    if (type === 'line') {
      const lines = JSON.parse(fs.readFileSync(linePath, 'utf8'));

      algorithm = {
        object_detect_threshold: general.object_detect_threshold,
        cross_line: lines.map((line) => ({
          line_caption: line.line_caption,
          line_start: line.line_start,
          line_end: line.line_end,
          line_color: rgb(line.line_color),
          cross_direction: line.cross_direction,
          show_line: true,
        })),
      };
    }

    // ZONE
    else if (type === 'zone') {
      const zone = JSON.parse(fs.readFileSync(zonePath, 'utf8'));

      algorithm = {
        object_detect_threshold: general.object_detect_threshold,
        zone_detect: [
          {
            normal_bold: zone.normal_bold,
            normal_color: rgb(zone.normal_color),
            alert_bold: zone.alert_bold,
            alert_color: rgb(zone.alert_color),
            show_zone: true,
            polygon: zone.polygon,
          },
        ],
      };
    } else {
      throw new Error('❌ Invalid DB type');
    }

    // VIDEO SOURCE
    let video_source;

    if (src.type === 'file') {
      video_source = {
        source_type: 'file',
        enable_log: general.enable_log,
        source_info: src.path,
        fps: general.fps,
        object_min_length: general.object_min_length,
        capture_interval: general.capture_interval,
        algorithm,
      };
    } else {
      const rtsp = src.path;

      video_source = {
        source_type: 'rtsp',
        enable_log: general.enable_log,
        ip_address: rtsp.ip,
        port: rtsp.port,
        user: rtsp.username,
        pass: rtsp.password,
        source_info: rtsp.streamPath || '/',
        fps: general.fps,
        object_min_length: general.object_min_length,
        capture_interval: general.capture_interval,
        algorithm,
      };
    }

    // FINAL DB STRUCTURE
    const dbData = {
      show_video: {
        show: general.show,
        ratio: general.ratio,
      },
      use_gpu: general.use_gpu,
      video_source,
    };

    const outputName = `${src.name}.${type}.db`;
    const outputPath = path.join(dbDir, outputName);

    fs.writeFileSync(outputPath, JSON.stringify(dbData, null, 2));

    console.log(`🟢 Created: ${outputPath}`);
  }
};

module.exports = db;
