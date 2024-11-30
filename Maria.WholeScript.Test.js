const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

async function main() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto('https://www.travelstart.co.za/');
        await page.waitForLoadState('load'); // Ensure the page is fully loaded

        await page.click('button:has-text("Yes")');
        await page.waitForSelector('input[name="dept_city"]', { state: 'visible', timeout: 60000 });
        await page.fill('input[name="dept_city"]', 'Cape Town'); // Corrected selector for 'From' input field
        await page.waitForSelector('li:has-text("Cape Town, International Cape Town, South Africa CPT")', { state: 'visible', timeout: 60000 });
        await page.click('li:has-text("Cape Town, International Cape Town, South Africa CPT")');
        
        await page.waitForSelector('input[name="arrival_city"]', { state: 'visible', timeout: 60000 });
        await page.fill('input[name="arrival_city"]', 'London'); // Corrected selector for 'To' input field
        await page.waitForSelector('li:has-text(/London, All Airports London, United Kingdom LON/i)', { state: 'visible', timeout: 60000 });
        await page.click('li:has-text(/London, All Airports London, United Kingdom LON/i)');
        
        await page.waitForSelector('td:has-text("19")', { state: 'visible', timeout: 60000 });
        await page.click('td:has-text("19")');

        await page.waitForSelector('input[name="arr_date"]', { state: 'visible', timeout: 60000 });
        await page.click('input[name="arr_date"]');
        await page.waitForSelector('td:has-text("2")', { state: 'visible', timeout: 60000 });
        await page.click('td:has-text("2")');

        await page.waitForSelector('button:has-text("Search Flights")', { state: 'visible', timeout: 60000 });
        await page.click('button:has-text("Search Flights")');
        
        await page.waitForURL('**/results');
        await page.waitForLoadState();
        await page.waitForTimeout(3000);

        const count1 = await page.locator('app-flight-card').count();
        expect(count1).toBeGreaterThanOrEqual(1);
    } catch (error) {
        console.error('Error during test execution:', error);
    } finally {
        // Ensure that the browser is closed even if an error occurs
        await browser.close();
    }
}

main().catch(console.error);