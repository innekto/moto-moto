import { launch } from 'puppeteer';

(async () => {
  const browser = await launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });
  const page = await browser.newPage();

  await page.goto('https://motomoto.ua/uk/skuteri', {
    waitUntil: 'domcontentloaded',
  });

  let isMoreButtonVisible = true;

  while (isMoreButtonVisible) {
    try {
      isMoreButtonVisible = await page.evaluate(() => {
        const button = document.querySelector('a.seomore_a');
        return !!button;
      });

      if (isMoreButtonVisible) {
        await page.click('a.seomore_a');
        console.log('Кнопка натиснута, очікуємо...');
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Заміна на setTimeout
      }
    } catch (error) {
      console.error('Помилка при перевірці/натисканні кнопки:', error);
      isMoreButtonVisible = false;
    }
  }

  console.log('Усі товари підвантажено.');

  const results = await page.evaluate(() => {
    const items = document.querySelectorAll('li.product');
    return items.length;
  });
  console.log(results);

  await browser.close();
})();
