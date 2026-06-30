const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureScreens() {
  const outputDir = path.join(__dirname, 'design_qa_screens');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const page = await browser.newPage();
  
  // Emulate an iPhone 13
  await page.emulate(puppeteer.KnownDevices['iPhone 13']);

  console.log('Navigating to app...');
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
  
  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 2000));

  console.log('Capturing Home screen...');
  await page.screenshot({ path: path.join(outputDir, '1_Home.png') });

  // Click Quiz Library tab
  console.log('Navigating to Quiz Library...');
  const tabs = await page.$$('div[role="button"]'); // Try to find the tab buttons by checking their text content
  
  async function clickTab(tabName) {
    const elements = await page.$$('div');
    for (const el of elements) {
      const text = await page.evaluate(e => e.innerText, el);
      if (text && text.trim() === tabName) {
        await el.click();
        await new Promise(r => setTimeout(r, 2000)); // wait for navigation/animations
        return true;
      }
    }
    return false;
  }

  await clickTab('Quiz Library');
  console.log('Capturing Quiz Library screen...');
  await page.screenshot({ path: path.join(outputDir, '2_QuizLibrary.png') });

  await clickTab('AI Quiz');
  console.log('Capturing AI Quiz screen...');
  await page.screenshot({ path: path.join(outputDir, '3_AIQuiz.png') });

  await clickTab('My Rewards');
  console.log('Capturing My Rewards screen...');
  await page.screenshot({ path: path.join(outputDir, '4_MyRewards.png') });

  // Close browser
  await browser.close();
  console.log('Screenshots saved to design_qa_screens/');
}

captureScreens().catch(console.error);
