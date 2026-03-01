# aiMediaManager

A command‑line tool to generate configuration databases and run AI media processing using **aiMediaConnector**.

This utility helps prepare `.db` files for video files or RTSP streams, draw detection zones/lines, and execute the engine in batch or single mode.

---

## Requirements

Before using this tool, ensure the following are installed:

### System Dependencies

- **Node.js ≥ 18**
- **FFmpeg** (must include `ffprobe`)
- **libtbb-dev**
- Linux environment (tested on Ubuntu 24.04)

Install on Ubuntu:

```bash
sudo apt update
sudo apt install ffmpeg libtbb-dev
```

Verify:

```bash
node -v
ffmpeg -version
ffprobe -version
```

---

## Engine Requirements

The following binaries must be placed under:

```
./src/engine/
```

Required files:

```
aiMediaConnector
drawLine
library/   (all required shared libraries)
```

---

## Installation

Clone your repository and install Node dependencies (if any):

```bash
git clone <repo>
cd aiMediaManager
```

No additional npm packages are required unless your project uses them.

---

## Usage

Run the CLI with:

```bash
node aiMediaManager.js <command>
```

To see all available commands:

```bash
node aiMediaManager.js help
```

---

## Main Features

### Draw Detection Points

Launch drawing tool using video or RTSP:

```bash
node aiMediaManager.js draw:file
node aiMediaManager.js draw:rtsp
```

Check saved coordinates:

```bash
node aiMediaManager.js draw:check
```

---

### Generate Database Files

Generate DBs for videos:

```bash
node aiMediaManager.js db:line:file
node aiMediaManager.js db:zone:file
```

Generate DB for RTSP stream:

```bash
node aiMediaManager.js db:line:rtsp
node aiMediaManager.js db:zone:rtsp
```

List generated DBs:

```bash
node aiMediaManager.js db:list:file
node aiMediaManager.js db:list:rtsp
```

---

### Run aiMediaConnector

Run using first available DB:

```bash
node aiMediaManager.js run:file
node aiMediaManager.js run:rtsp
```

Run specific DB by index:

```bash
node aiMediaManager.js run:file 2
node aiMediaManager.js run:rtsp 0
```

Batch execution (run multiple DBs simultaneously):

```bash
node aiMediaManager.js run:batch:<N>
```

Example — run 3 at a time:

```bash
node aiMediaManager.js run:batch:3
```

---

## Notes

- Video files are automatically validated using `ffprobe`
- DB files are generated per video
- RTSP DBs are timestamped
- Engine runs with `LD_LIBRARY_PATH` pointing to the bundled libraries

---

## Troubleshooting

### Engine fails to start

Ensure:

- Executables have permission:

```bash
chmod +x src/engine/aiMediaConnector
chmod +x src/engine/drawLine
```

- Libraries exist in:

```
src/engine/library/
```

---

## License

See LICENSE file for details.

---

## Author

Alex Chen
