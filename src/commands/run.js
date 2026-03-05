const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const updateCountLog = require('../countLog');

const { removeEmpty } = require('../utils');

const runConnector = (enginePath, dbPath, libPath) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(enginePath, [dbPath], {
      env: { ...process.env, LD_LIBRARY_PATH: libPath },
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      console.log(`🟢 Finished: ${path.basename(dbPath)} (code ${code})`);
      resolve();
    });

    proc.on('error', reject);
  });
};

const getDbFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.db'))
    .map((file) => path.join(dir, file));
};

const run = async (mode, arg) => {
  const root = process.cwd();

  const enginePath = path.join(root, 'src/engine/aiMediaConnector');
	
  const libPath = path.join(root, 'src/engine/library');
	removeEmpty(libPath);

  const dbFileDir = path.join(root, 'db/file');
  const dbRtspDir = path.join(root, 'db/rtsp');

  if (!fs.existsSync(enginePath)) {
    throw new Error('❌ aiMediaConnector not found');
  }

  // FILE MODE
  if (mode === 'file' || mode === 'rtsp') {
    const dbDir = mode === 'file' ? dbFileDir : dbRtspDir;
    const dbFiles = getDbFiles(dbDir);

    if (!dbFiles.length) {
      throw new Error('❌ No DB files found');
    }

    const index = arg ? parseInt(arg, 10) : 0;

    if (isNaN(index) || index < 0 || index >= dbFiles.length) {
      throw new Error('❌ Invalid DB index');
    }

    const dbPath = dbFiles[index];

    console.log(`Running: ${path.basename(dbPath)}`);

    await runConnector(enginePath, dbPath, libPath);

		// update after single run
		updateCountLog();

    return;
  }

  // BATCH MODE
  if (mode === 'batch') {
    const batchSize = parseInt(arg, 10);

    if (!batchSize || batchSize <= 0) {
      throw new Error('❌ Invalid batch size');
    }

    const dbFiles = [...getDbFiles(dbFileDir), ...getDbFiles(dbRtspDir)];

    if (!dbFiles.length) {
      throw new Error('❌ No DB files found');
    }

    console.log(`Batch mode: ${batchSize} parallel processes`);

    for (let i = 0; i < dbFiles.length; i += batchSize) {
      const batch = dbFiles.slice(i, i + batchSize);

      console.log(`▶️ Running batch ${Math.floor(i / batchSize) + 1}`);

      await Promise.all(
        batch.map((dbPath) => runConnector(enginePath, dbPath, libPath)),
      );

			// update after batch
			updateCountLog();
    }

    console.log('🟢 All batches completed');
    return;
  }

  throw new Error('❌ Invalid run mode');
};

module.exports = run;
