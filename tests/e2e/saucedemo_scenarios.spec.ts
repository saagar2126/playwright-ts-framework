import { test, expect } from '../../src/fixtures/testFixtures';
import { Logger } from '../../src/utils/Logger';

test.describe('SauceDemo Comprehensive Multi-Scenario Test Suite', () => {

    test('Scenario 1: End-to-End Standard Checkout Flow', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }, testInfo) => {
        Logger.info('=== STARTING TEST: E2E Standard Checkout Flow ===', testInfo);
        
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        Logger.success('User successfully logged in with standard credentials', testInfo);
        
        await expect(page).toHaveURL(/.*inventory.html/);

        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        Logger.step('Added "Sauce Labs Backpack" to cart', testInfo);
        
        await inventoryPage.goToCart();
        await cartPage.verifyProductInCart('Sauce Labs Backpack');
        Logger.success('Verified product is present in shopping cart', testInfo);
        
        await cartPage.proceedToCheckout();
        await checkoutPage.fillCustomerDetails('Selva', 'R', '600001');
        Logger.step('Filled customer shipping details', testInfo);
        
        await checkoutPage.completeOrder();
        await expect(checkoutPage.orderCompleteHeader).toHaveText('Thank you for your order!');
        Logger.success('=== TEST PASSED: E2E Standard Checkout Flow ===', testInfo);
    });

    test('Scenario 2: Validate Dropdown Sorting functionality', async ({ loginPage, inventoryPage }, testInfo) => {
        Logger.info('=== STARTING TEST: Dropdown Sorting Validation ===', testInfo);
        
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        
        Logger.step('Selecting inventory sort filter: Price (low to high)', testInfo);
        await inventoryPage.sortProductsBy('Price (low to high)');
        
        const prices = await inventoryPage.getInventoryPrices();
        Logger.info(`Extracted inventory prices for validation: [${prices.join(', ')}]`, testInfo);
        
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
        Logger.success('=== TEST PASSED: Dropdown Sorting Validation ===', testInfo);
    });

    test('Scenario 3: Verify Locked Out User Error Handling', async ({ loginPage }, testInfo) => {
        Logger.info('=== STARTING TEST: Locked Out User Error Handling ===', testInfo);
        
        await loginPage.goTo();
        await loginPage.login('locked_out_user', 'secret_sauce');
        
        await expect(loginPage.errorMessage).toBeVisible();
        Logger.success('Locked-out error banner correctly displayed to user', testInfo);
        Logger.success('=== TEST PASSED: Locked Out User Error Handling ===', testInfo);
    });

    test('Scenario 4: Performance Glitch User Inventory Load', async ({ loginPage, inventoryPage, page }, testInfo) => {
        Logger.info('=== STARTING TEST: Performance Glitch User Flow ===', testInfo);
        
        await loginPage.goTo();
        await loginPage.login('performance_glitch_user', 'secret_sauce');
        
        await expect(page).toHaveURL(/.*inventory.html/);
        const itemsCount = await inventoryPage.inventoryItems.count();
        expect(itemsCount).toBeGreaterThan(0);
        Logger.success(`Successfully loaded inventory grid with ${itemsCount} items under delayed conditions`, testInfo);
        Logger.success('=== TEST PASSED: Performance Glitch User Flow ===', testInfo);
    });

    test('Scenario 5: Problem User Image State Validation', async ({ loginPage, page }, testInfo) => {
        Logger.info('=== STARTING TEST: Problem User Asset Validation ===', testInfo);
        
        await loginPage.goTo();
        await loginPage.login('problem_user', 'secret_sauce');
        
        const firstImage = page.locator('[data-test="item-4-img-link"] img');
        await expect(firstImage).toBeVisible();
        Logger.success('Verified target item image container state', testInfo);
        Logger.success('=== TEST PASSED: Problem User Asset Validation ===', testInfo);
    });

});