import { test, expect } from '@playwright/test';

test('サイト内の外部リンクが切れていないかチェックするっス', async ({ page }) => {
  // ① チェックしたい自分のサイトのURLをここに入れるっス！
  const targetUrl = process.env.TARGET_URL || 'https://www.google.com/';
  await page.goto(targetUrl);
  // ② ページ内の外部リンクを全部取得するっス
  // href属性が"http"で始まるaタグを探してるっス
  const externalLinks = page.locator('a[href^="http"]');
  const allLinks = await externalLinks.all(); // 配列として取得

  console.log(`チェックする外部リンクの数: ${allLinks.length}個っス`);

  // ③ forループで、一つずつリンクをチェックしていくっス
  for (const link of allLinks) {
    const url = await link.getAttribute('href');

    // URLが null じゃなかったらチェック開始
    if (url) {
      try {
        // page.goto()だとページ遷移しちゃうので、リクエストだけ送るのがコツっス
        const response = await page.request.get(url, {
            failOnStatusCode: true // 2xx, 3xx 以外のステータスコードならエラーにする
        });

        // ステータスがOK（200番台）なら成功！
        expect(response.ok()).toBe(true);
        console.log(`✅ OK: ${url}`);

      } catch (error) {
        // もしリンク切れなどでエラーが起きたら、ここに飛んでくるっス
        console.error(`❌ NG: ${url} - ${error.message}`);
        
        // テストを失敗させたい場合は、以下のコメントを外すっス
        // throw new Error(`${url} へのリンクが切れている可能性があるっス！`);
      }
    }
  }
});