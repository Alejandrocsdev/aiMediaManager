const db = require('./db');
const run = require('./run');
const help = require('./help');
const draw = require('./draw');

const commands = (argv) => {
  const args = argv.slice(2);

  const command = args[0];

  if (!command) {
    throw new Error(
      '❌ Missing command, use "help" for a list of available commands',
    );
  }

  if (args.length > 1) {
    throw new Error('❌ Too many arguments');
  }

  switch (command) {
    case 'help':
      return help();
    case 'draw:check':
      return draw('check');
    case 'draw:file':
      return draw('file');
    case 'draw:rtsp':
      return draw('rtsp');
    case 'db:list:file':
      return db('list:file');
    case 'db:list:rtsp':
      return db('list:rtsp');
    case 'db:line:file':
      return db('line:file');
    case 'db:line:rtsp':
      return db('line:rtsp');
    case 'db:zone:file':
      return db('zone:file');
    case 'db:zone:rtsp':
      return db('zone:rtsp');
    case 'run:file':
      return run('file', args[1]);
    case 'run:rtsp':
      return run('rtsp', args[1]);
  }

  if (command.startsWith('run:batch:')) {
    const size = command.split(':')[2];
    return run('batch', size);
  }

  throw new Error(`❌ Unknown or malformed command: "${command}"`);
};

module.exports = commands;
