import { test, expect } from '../../src/fixtures/testFixtures';

test.describe('SauceDemo E2E Checkout Flow', () => {
    test('Should successfully login, add item to cart, and complete checkout', async ({
        loginPage,
        inventoryPage,
        cartPage,
        checkoutPage,
        page,
    }) => {
        // 1. Navigate and Login
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/.*inventory.html/);

        // 2. Add Product to Cart
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();

        // 3. Verify Cart and Proceed
        await cartPage.verifyProductInCart('Sauce Labs Backpack');
        await cartPage.proceedToCheckout();

        // 4. Fill Checkout Details and Complete Order
        await checkoutPage.fillCustomerDetails('John', 'Doe', '600001');
        await checkoutPage.completeOrder();
        await expect(checkoutPage.orderCompleteHeader).toHaveText('Thank you for your order!');
    });
});