const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// renderer.jsからの依頼を受け取る場所
ipcMain.on('run-playwright', (event, options) => {
  const { mode, url } = options;
  const env = { ...process.env, TARGET_URL: url };
  const projectRoot = path.join(__dirname, '..', '..');

  const nodeExecutable = process.execPath;
  const playwrightCli = path.join(projectRoot, 'node_modules', '@playwright', 'test', 'cli.js');

  // 実行する引数を組み立てる
  let commandArgs = [
    playwrightCli,
    'test',
    '--headed' // ★★★最終的にこれを採用！★★★
  ];
  if (mode === 'update') {
    commandArgs.push('--update-snapshots');
  }

  const child = spawn(nodeExecutable, commandArgs, { env, cwd: projectRoot });

  // 文字化けを防ぐ
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  // 実行中のログをリアルタイムでUI画面に送る
  child.stdout.on('data', (data) => {
    event.sender.send('update-log', data.toString());
  });
  child.stderr.on('data', (data) => {
    event.sender.send('update-log', `エラー: ${data.toString()}`);
  });

  // 実行が終わったらメッセージを送る
  child.on('close', (code) => {
    event.sender.send('update-log', `\n--- 処理完了 (終了コード: ${code}) ---`);
  });
});