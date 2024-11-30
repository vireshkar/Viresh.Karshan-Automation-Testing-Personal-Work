const playwright = require('playwright');
const { expect } = require('@playwright/test');
const { describe, it, afterAll } = require('jest');

describe('Travelstart Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await playwright.chromium.launch({ headless: false });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should navigate to the website and accept cookies', async () => {
        await page.goto('https://www.travelstart.co.za/');
        await page.getByRole('button', { name: 'Yes' }).click();
    });

    it('should fill the departure city', async () => {
        await page.getByLabel('dept_city').fill('Cape Town');
        await page.getByRole('option', { name: 'Cape Town, International Cape Town, South Africa CPT' }).click();
    });

    it('should fill the destination city', async () => {
        await page.getByRole('option', { name: /London, All Airports London, United Kingdom LON/i }).click();
    });

    it('should select departure and return dates', async () => {
        await page.getByLabel('Thursday, December 19,').getByText('19').click();
        await page.getByLabel('arr_date').click();
        await page.getByLabel('Thursday, January 2,').nth(1).click();
    });

    it('should search for flights and verify results', async () => {
        await page.getByRole('button', { name: 'Search Flights' }).click();
        await expect(page.url()).toContain('/results');
        await page.waitForLoadState();
        await page.waitForTimeout(3000);

        const count1 = await page.locator('app-flight-card').count();
        expect(count1).toBeGreaterThanOrEqual(1);
    });
});