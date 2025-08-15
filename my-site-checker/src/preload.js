// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // renderer.jsから呼べる関数を定義
  runPlaywright: (options) => ipcRenderer.send('run-playwright', options),
  // メイン機能からのメッセージを受け取る関数を定義
  onUpdateLog: (callback) => ipcRenderer.on('update-log', callback)
});