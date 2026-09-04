import { test, expect } from '../../src/fixtures/testFixtures';
import { UIHelpers } from '../../src/utils/UIHelpers';

test.describe('SauceDemo Comprehensive Multi-Scenario Test Suite', () => {

    test('Scenario 1: End-to-End Standard Checkout Flow', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/.*inventory.html/);

        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();

        await cartPage.verifyProductInCart('Sauce Labs Backpack');
        await cartPage.proceedToCheckout();

        await checkoutPage.fillCustomerDetails('Selva', 'R', '600001');
        await checkoutPage.completeOrder();
        await expect(checkoutPage.orderCompleteHeader).toHaveText('Thank you for your order!');
    });

    test('Scenario 2: Validate Dropdown Sorting functionality (Price Low to High)', async ({ loginPage, inventoryPage }) => {
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');

        // Select sort dropdown filter
        await inventoryPage.sortProductsBy('Price (low to high)');
        
        const prices = await inventoryPage.getInventoryPrices();
        // Assert that prices are sorted in ascending order
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
    });

    test('Scenario 3: Verify Locked Out User Error Handling (Alert/Validation UI)', async ({ loginPage, page }) => {
        await loginPage.goTo();
        await loginPage.login('locked_out_user', 'secret_sauce');
        
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
    });

    test('Scenario 4: Performance Glitch User Inventory Load & Multi-Item Grid Check', async ({ loginPage, inventoryPage, page }) => {
        await loginPage.goTo();
        // Utilizing performance glitch user to test delayed rendering elements
        await loginPage.login('performance_glitch_user', 'secret_sauce');
        
        await expect(page).toHaveURL(/.*inventory.html/);
        const itemsCount = await inventoryPage.inventoryItems.count();
        expect(itemsCount).toBeGreaterThan(0);
    });

    test('Scenario 5: Problem User Image/Asset State Validation', async ({ loginPage, page }) => {
        await loginPage.goTo();
        await loginPage.login('problem_user', 'secret_sauce');
        
        // Problem user intentionally serves a broken image asset; verify fallback handling or app state
        const firstImage = page.locator('[data-test="item-4-img-link"] img');
        await expect(firstImage).toBeVisible();
    });

});