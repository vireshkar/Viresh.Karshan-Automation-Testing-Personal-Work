const playwright = require('playwright');
const { expect } = require('@playwright/test');
const assert = require('assert');

async function main() {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
			
	await page.goto('https://www.travelstart.co.za/');
	await page.getByRole('button', { name: 'Yes' }).click();
	await page.getByLabel('dept_city').fill('Cape Town');
	await page.getByRole('option', { name: 'Cape Town, International Cape Town, South Africa CPT' }).click();
	await page.getByRole('option', { name: /London, All Airports London, United Kingdom LON/i }).click();
	await page.getByLabel('Thursday, December 19,').getByText('19').click();

	await page.getByLabel('arr_date').click();
	await page.getByLabel('Thursday, January 2,').nth(1).click();

	await page.getByRole('button', { name: 'Search Flights' }).click();
	await expect(page.url()).toContain('/results');
	await page.waitForLoadState();
	await page.waitForTimeout(3000);

	const count1 = await page.locator('app-flight-card').count();
	expect(count1).toBeGreaterThanOrEqual(1);

    //await browser.close();
}

main().catch(console.error);
