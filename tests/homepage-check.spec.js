// 必要なものをPlaywrightから呼び出すっス
import { test, expect } from '@playwright/test';

// これがテストの本体っス
test('トップページの見た目が変わってないかチェックするっス', async ({ page }) => {

  // ① チェックしたい自分のサイトのURLをここに入れるっス！
  const targetUrl = process.env.TARGET_URL || 'https://www.google.com/';
  await page.goto(targetUrl);

  // ② ページ全体のスクリーンショットを撮って、前の画像と比較するっス！
  // 'homepage.png' は好きな名前でOKっス。
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true, // ページ全体を撮るオプションっス
    maxDiffPixelRatio: 0.02 // ほんの少しの違いは許す設定っス(広告とかで毎回失敗するのを防ぐ)
  });

});