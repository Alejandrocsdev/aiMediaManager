const { spawnSync } = require('child_process');

const isVideo = (file) => {
  const res = spawnSync('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=codec_type',
    '-of',
    'default=nw=1:nk=1',
    file,
  ]);

  return res.stdout.toString().trim() === 'video';
};

module.exports = isVideo;
