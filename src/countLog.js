const fs = require('fs');
const path = require('path');

const root = process.cwd();

const videosDir = path.join(root, 'videos');
const countLogPath = path.join(root, 'count.log');

const readLog = () => {
  const set = new Set();

  if (!fs.existsSync(countLogPath)) {
    return set;
  }

  const content = fs.readFileSync(countLogPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(Boolean);

  for (const line of lines) {
    const index = line.indexOf(':');
    if (index === -1) continue;

    const name = line.slice(0, index).trim();
    if (name) set.add(name);
  }

  return set;
};

const extractTotalCount = (logContent) => {
  const match = logContent.match(/total\s+count\s*:\s*(\d+)/i);
  return match ? Number(match[1]) : 0;
};

const updateCountLog = () => {
  if (!fs.existsSync(videosDir)) {
    console.log('❌ videos folder not found');
    return;
  }

  const already = readLog();

  const files = fs.readdirSync(videosDir);
  const logFiles = files.filter((file) =>
    file.toLowerCase().endsWith('.mp4.log'),
  );

  let appended = 0;

  for (const logFile of logFiles) {
    const fullPath = path.join(videosDir, logFile);

    const videoName = logFile.replace('.log', '');

    if (already.has(videoName)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const total = extractTotalCount(content);

    fs.appendFileSync(countLogPath, `${videoName}: ${total}\n`);

    console.log(`Logged ${videoName}`);

    already.add(videoName);
    appended++;
  }

  if (appended) {
    console.log(`✅ Updated count.log (${appended} new entries)`);
  }
};

module.exports = updateCountLog;
