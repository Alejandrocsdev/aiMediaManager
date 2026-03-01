const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const { isVideo } = require('../utils');

const draw = (mode) => {
  const root = process.cwd();

  const videoDir = path.join(root, 'video');
	
	const configDir = path.join(root, 'config');
  const rtspPath = path.join(configDir, 'rtsp.json');
  const generalPath = path.join(configDir, 'general.json');

  const engineDir = path.join(root, 'src', 'engine');
  const drawLinePath = path.join(engineDir, 'drawLine');
  const tempDbPath = path.join(engineDir, 'temp.db');
  const logPath = path.join(engineDir, 'draw.log');

  // CHECK MODE
  if (mode === 'check') {
    if (!fs.existsSync(logPath)) {
      console.log('❌ No draw.log found');
      return;
    }

    console.log('🟢 Draw Log:\n');
    console.log(fs.readFileSync(logPath, 'utf8'));
    return;
  }

  if (!fs.existsSync(generalPath)) {
    console.log('❌ No general.json found');
    return;
  }

  const general = JSON.parse(fs.readFileSync(generalPath, 'utf8'));

  const ratio = general.ratio;

  let dbContent;

  // FILE MODE
  if (mode === 'file') {
    if (!fs.existsSync(videoDir)) {
      throw new Error('❌ video folder not found');
    }

    const files = fs.readdirSync(videoDir);

    let videoPath = null;

    for (const file of files) {
      const full = path.join(videoDir, file);
      if (fs.statSync(full).isFile() && isVideo(full)) {
        videoPath = full;
        break;
      }
    }

    if (!videoPath) {
      throw new Error('❌ No valid video file found');
    }

    dbContent = {
      show_video: { ratio },
      video_source: {
        source_type: 'file',
        source_info: videoPath,
      },
    };
  }

  // RTSP MODE
  else if (mode === 'rtsp') {
    if (!fs.existsSync(rtspPath)) {
      throw new Error('❌ rtsp.json not found');
    }

    const rtsp = JSON.parse(fs.readFileSync(rtspPath, 'utf8'));

    dbContent = {
      show_video: { ratio },
      video_source: {
        source_type: 'rtsp',
        ip_address: rtsp.ip,
        port: rtsp.port,
        user: rtsp.username,
        pass: rtsp.password,
        source_info: rtsp.streamPath,
      },
    };
  } else {
    throw new Error('❌ Invalid draw mode');
  }

  // WRITE TEMP DB
  fs.writeFileSync(tempDbPath, JSON.stringify(dbContent, null, 2));

  // REDIRECT OUTPUT
  // File Descriptor: A numeric handle the OS uses to access an open file
  const outputFd = fs.openSync(logPath, 'w');

  const child = spawn(drawLinePath, [tempDbPath], {
    cwd: engineDir,
    stdio: ['ignore', outputFd, 'ignore'],
  });

  console.log('Draw points, then press ENTER to finish...');

  // Start reading input from keyboard
  process.stdin.resume();
  // Run callback only for the FIRST event
  process.stdin.once('data', () => child.kill('SIGINT'));
  // process.stdin.on():
  // Run callback for EVERY event

  // AFTER drawLine finishes
  child.on('close', () => {
    try {
      let raw = fs.readFileSync(logPath, 'utf8');

      const doubled = [];

      const lines = raw
        .split('\n')
        .filter((line) => line.includes('{') && line.includes('}'));

      const regex =
        /["']?x["']?\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*["']?y["']?\s*:\s*(-?\d+(?:\.\d+)?)/i;

      for (const line of lines) {
        const match = line.match(regex);
        if (!match) continue;

        const x = Number(match[1]) * 2;
        const y = Number(match[2]) * 2;

        doubled.push(`{ "x": ${x}, "y": ${y} }`);
      }

      fs.writeFileSync(logPath, doubled.join('\n') + '\n');
    } catch (error) {
      console.error('❌ Failed to process draw.log:', error);
    }

    try {
      fs.unlinkSync(tempDbPath);
    } catch (error) {
      console.error('❌ Failed to remove Temporary DB:', error);
    }

    process.exit(0);
  });

  child.on('error', (error) => {
    console.error('❌ Failed to start drawLine:', error);
  });
};

module.exports = draw;
