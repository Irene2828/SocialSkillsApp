const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:8084/', { waitUntil: 'networkidle2' });
  
  // wait for it to load
  await new Promise(r => setTimeout(r, 2000));
  
  // click the second tab (NewQuizScreen) to trigger the crash
  const libraryTab = await page.$('div[role="button"][tabindex="0"]:nth-of-type(2)');
  if (libraryTab) {
      await libraryTab.click();
  } else {
      // try another selector
      const tabs = await page.$$('div[role="button"]');
      if (tabs.length >= 2) {
          await tabs[1].click();
      }
  }

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
