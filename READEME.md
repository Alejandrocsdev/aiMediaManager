# aiMediaManager

## 🖥️ 作業系統
Ubuntu 22.04

## ⚙️ 必要套件安裝
```bash
sudo apt install libtbb-dev curl
```

## 🧰 安裝 Node.js

#### 安裝 NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

#### 加入啟動腳本到 .bashrc
```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
source ~/.bashrc
```

#### 安裝最新版 LTS 的 Node.js 並設為預設
```bash
nvm install --lts
nvm alias default lts/*
```

## 🔐 設定執行權限
```bash
chmod +x .aiMediaConnector/aiMediaConnector
```

## 🚀 執行指令 (參閱指令說明)
```bash
node aiMediaManager.js help
```