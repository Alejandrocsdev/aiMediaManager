const fs = require('fs');
const path = require('path');

const { rgb, timestamp, isVideo, removeEmpty } = require('../utils');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const listDbFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log('No DB folder found');
    return;
  }

  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.db'));

  if (!files.length) {
    console.log('No DB files found');
    return;
  }

  files.forEach((file, index) => {
    console.log(`[${index}] ${file}`);
  });
};

const db = (mode) => {
  const root = process.cwd();

  const videosDir = path.join(root, 'videos');
  removeEmpty(videosDir);

  const dbRoot = path.join(root, 'db');
  removeEmpty(dbRoot);

  const dbFileDir = path.join(dbRoot, 'file');
  const dbRtspDir = path.join(dbRoot, 'rtsp');

	const configDir = path.join(root, 'config');
  const linePath = path.join(configDir, 'line.json');
  const zonePath = path.join(configDir, 'zone.json');
  const rtspPath = path.join(configDir, 'rtsp.json');
  const generalPath = path.join(configDir, 'general.json');

  const [type, source] = mode.split(':');

  // LIST MODE → list existing DB files
  if (type === 'list') {
    if (source === 'file') return listDbFiles(dbFileDir);
    if (source === 'rtsp') return listDbFiles(dbRtspDir);
    throw new Error('❌ Invalid list mode');
  }

  const general = JSON.parse(fs.readFileSync(generalPath, 'utf8'));

  let sourceList = [];

  // FILE MODE → generate DB for each video
  if (source === 'file') {
    ensureDir(dbFileDir);

    if (!fs.existsSync(videosDir)) {
      throw new Error('❌ videos folder not found');
    }

    const files = fs.readdirSync(videosDir);

    for (const file of files) {
      const full = path.join(videosDir, file);

      if (!fs.statSync(full).isFile() || !isVideo(full)) {
        continue;
      }

      sourceList.push({
        type: 'file',
        path: full,
        name: path.parse(file).name,
        outDir: dbFileDir,
      });
    }

    if (!sourceList.length) {
      throw new Error('❌ No valid video files found');
    }
  }

  // RTSP MODE → single DB for RTSP stream
  else if (source === 'rtsp') {
    ensureDir(dbRtspDir);

    if (!fs.existsSync(rtspPath)) {
      throw new Error('❌ rtsp.json not found');
    }

    const full = JSON.parse(fs.readFileSync(rtspPath, 'utf8'));

    sourceList.push({
      type: 'rtsp',
      path: full,
      name: `rtsp-${timestamp()}`,
      outDir: dbRtspDir,
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
    const outputPath = path.join(src.outDir, outputName);

    fs.writeFileSync(outputPath, JSON.stringify(dbData, null, 2));

    console.log(`🟢 Created: ${outputPath}`);
  }
};

module.exports = db;
