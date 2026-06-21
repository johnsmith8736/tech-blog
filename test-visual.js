import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 等待页面加载完成
  await page.waitForLoadState('domcontentloaded');

  // 截图查看效果
  await page.screenshot({
    path: '/home/arch/Downloads/tech-blog/blog-screenshot.png',
    fullPage: true
  });

  console.log('Screenshot saved to blog-screenshot.png');

  // 获取页面标题
  const title = await page.title();
  console.log('Page title:', title);

  // 检查是否有posts显示
  const postsCount = await page.$$eval('.post-card, .post-item, [class*="post"]', elements => elements.length);
  console.log('Posts found:', postsCount);

  await browser.close();
})();