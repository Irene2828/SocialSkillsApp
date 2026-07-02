const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runQAScreenshots() {
  const outputDir = '/Users/irynaherz/socialskills/SocialSkillsApp/qa-screenshots';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const page = await browser.newPage();
  await page.emulate(puppeteer.KnownDevices['iPhone 13']);

  console.log('Navigating to app...');
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));

  async function clickText(text) {
    const elements = await page.$$('div, span, p, a, button');
    for (const el of elements) {
      const elText = await page.evaluate(e => e.innerText, el);
      if (elText && elText.trim() === text) {
        try { await el.click(); } catch(e) {}
        await new Promise(r => setTimeout(r, 1200));
        return true;
      }
    }
    return false;
  }
  
  async function clickContainingText(text) {
    const elements = await page.$$('div, span, p, a, button');
    for (const el of elements) {
      const elText = await page.evaluate(e => e.innerText, el);
      if (elText && elText.includes(text)) {
        try { await el.click(); } catch(e) {}
        await new Promise(r => setTimeout(r, 1200));
        return true;
      }
    }
    return false;
  }

  // 1. Home Screen
  console.log('Capturing Home...');
  await page.screenshot({ path: path.join(outputDir, '01-home.png') });

  // 2. Settings -> FeedbackModal Confirm
  console.log('Testing Settings confirm modal...');
  await clickText('Settings');
  await new Promise(r => setTimeout(r, 1000));
  await clickText('Reset All Progress');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '02-settings-reset-modal.png') });
  await clickText('Cancel'); // Close it
  await new Promise(r => setTimeout(r, 1000));
  await clickText('Home'); // Back to home

  // 3. Quiz Library - General
  console.log('Navigating to Quiz Library...');
  await clickText('Quiz Library');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outputDir, '03-quiz-library-general.png') });

  // 4. AI Options Modal
  console.log('Opening AI Options modal...');
  await clickText('General'); // ensure general tab is active
  await clickContainingText('Create AI Quiz'); 
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '04-ai-options-modal.png') });
  
  // Close the modal
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // 5. My Rewards
  console.log('Navigating to My Rewards...');
  await clickText('My Rewards');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outputDir, '05-my-rewards-all.png') });

  // 6. Parent PIN (Add Reward)
  console.log('Opening Parent PIN...');
  await clickText('Add New Reward');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '06-parent-pin-empty.png') });

  // 7. Parent PIN Error (FeedbackModal)
  console.log('Triggering PIN error...');
  await page.keyboard.type('9999');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '07-parent-pin-error-modal.png') });
  
  // Close error modal
  await clickText('OK');
  await new Promise(r => setTimeout(r, 500));

  // Clear PIN and enter correct one
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('1111');
  await new Promise(r => setTimeout(r, 1500));

  // 8. Add Reward Form Modal
  console.log('Capturing Add Reward Form...');
  await page.screenshot({ path: path.join(outputDir, '08-add-reward-form.png') });
  
  // 9. Add Reward Success Toast
  await page.keyboard.type('Puppeteer Reward');
  await clickText('Cost');
  await page.keyboard.type('10');
  await clickText('Add Reward');
  await new Promise(r => setTimeout(r, 500)); // wait for toast
  await page.screenshot({ path: path.join(outputDir, '09-add-reward-success-toast.png') });
  await new Promise(r => setTimeout(r, 3000)); // wait for toast to hide

  // 10. Swipe to Delete Reveal
  console.log('Simulating swipe...');
  await page.mouse.move(300, 350);
  await page.mouse.down();
  await page.mouse.move(100, 350, { steps: 10 });
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '10-swipe-delete-reveal.png') });

  // 11. Feedback Modal (Correct/Incorrect)
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await clickText('Quiz Library');
  await new Promise(r => setTimeout(r, 1500));
  await clickText('Friendship');
  await new Promise(r => setTimeout(r, 2000));

  console.log('Answering question...');
  let answered = false;
  const divs = await page.$$('div');
  for (const div of divs) {
    const text = await page.evaluate(e => e.innerText, div);
    if (text && text.length > 5 && text.length < 100) {
      const role = await page.evaluate(e => e.getAttribute('role'), div);
      if (role === 'button') {
        try {
          await div.click();
          await new Promise(r => setTimeout(r, 1500));
          answered = true;
          break;
        } catch(e) {}
      }
    }
  }
  if (answered) {
    await page.screenshot({ path: path.join(outputDir, '11-quiz-feedback.png') });
  }

  // 12. Redeem Success Toast
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await clickText('My Rewards');
  await new Promise(r => setTimeout(r, 1500));

  console.log('Redeeming reward...');
  await clickText('Redeem');
  await new Promise(r => setTimeout(r, 500)); // wait for toast
  await page.screenshot({ path: path.join(outputDir, '12-redeem-success-toast.png') });

  await browser.close();
  console.log('All QA screenshots captured successfully.');
}

runQAScreenshots().catch(console.error);
