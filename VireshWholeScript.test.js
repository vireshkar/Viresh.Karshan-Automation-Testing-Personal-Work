const playwright = require('playwright');
const { expect } = require('@playwright/test');

async function main() {
  const browser = await playwright.chromium.launch({ headless: false });  // Set headless to false for visibility
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to Travelstart website
    await page.goto('https://www.travelstart.co.za/');

    // Accept cookies or close any popups
    await page.locator('button:has-text("Yes")').click();

    // Wait for the departure city input to be visible
    await page.waitForSelector('input[placeholder="Departure city"]', { state: 'visible', timeout: 60000 });
    await page.locator('input[placeholder="Departure city"]').fill('Cape Town');
    await page.locator('input[placeholder="Departure city"]').press('Enter');

    // Wait and select the destination city
    await page.waitForSelector('input[placeholder="Destination city"]', { state: 'visible', timeout: 60000 });
    await page.locator('input[placeholder="Destination city"]').fill('London');
    await page.locator('input[placeholder="Destination city"]').press('Enter');

    // Wait and select the departure date
    await page.waitForSelector('input[name="departure_date"]', { state: 'visible', timeout: 60000 });
    await page.locator('input[name="departure_date"]').fill('2024-12-19');
    await page.locator('input[name="return_date"]').fill('2025-01-02');

    // Wait for the "Search Flights" button to be clickable and click
    await page.waitForSelector('button:has-text("Search Flights")', { state: 'visible', timeout: 60000 });
    await page.locator('button:has-text("Search Flights")').click();

    // Wait for results to load and ensure that flight cards are displayed
    await page.waitForSelector('app-flight-card', { state: 'visible', timeout: 60000 });

    // Verify that flight results are displayed
    const count1 = await page.locator('app-flight-card').count();
    console.log(`Flight results count: ${count1}`);
    expect(count1).toBeGreaterThanOrEqual(1);  // Ensure at least one result is displayed

  } catch (error) {
    console.error('Error during script execution:', error);
    await page.screenshot({ path: 'error_screenshot.png' });  // Capture screenshot for debugging
  } finally {
    // Close the browser after the script finishes
    await browser.close();
  }
}

main();