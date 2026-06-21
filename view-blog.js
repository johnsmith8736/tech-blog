const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 等待页面加载完成
  await page.waitForLoadState('domcontentloaded');

  // 设置窗口大小
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Browser opened! You can now see the blog.');
  console.log('Press Ctrl+C to close the browser.');

  // 保持浏览器打开
  await new Promise(() => {});
})();