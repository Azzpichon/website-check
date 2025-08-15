const updateBtn = document.getElementById('updateBtn');
const checkBtn = document.getElementById('checkBtn');
const urlInput = document.getElementById('targetUrl');
const logArea = document.getElementById('log');

// 「お手本登録」ボタンが押された時の処理
updateBtn.addEventListener('click', () => {
  logArea.textContent = 'お手本の登録を開始します...';
  // preload.jsを介して、メイン機能に依頼！
  window.electronAPI.runPlaywright({
    mode: 'update',
    url: urlInput.value
  });
});

// 「変更チェック」ボタンが押された時の処理
checkBtn.addEventListener('click', () => {
  logArea.textContent = '変更のチェックを開始します...';
  window.electronAPI.runPlaywright({
    mode: 'check',
    url: urlInput.value
  });
});

// メイン機能からログが送られてきたら、画面に表示する
window.electronAPI.onUpdateLog((_event, message) => {
  logArea.textContent += `\n${message}`;
});