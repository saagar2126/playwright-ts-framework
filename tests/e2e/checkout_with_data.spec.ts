import { test, expect } from '../../src/fixtures/testFixtures';
import { TestDataManager } from '../../src/utils/TestDataManager';
import { Logger } from '../../src/utils/Logger';

test('E2E Checkout using Singleton Test Data Manager', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }, testInfo) => {
    // Fetch dataset via Singleton instance
    const data = TestDataManager.getInstance().getDataset('standardCheckoutUser');

    Logger.info(`Starting test for user: ${data.username}`, testInfo);

    await loginPage.goTo();
    await loginPage.login(data.username, data.password);
    
    await expect(page).toHaveURL(new RegExp(data.endpoint));

    await inventoryPage.addProductToCart(data.order.productName);
    await inventoryPage.goToCart();

    await cartPage.verifyProductInCart(data.order.productName);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerDetails(
        data.order.firstName, 
        data.order.lastName, 
        data.order.postalCode
    );
    
    await checkoutPage.completeOrder();
    await expect(checkoutPage.orderCompleteHeader).toHaveText('Thank you for your order!');
    Logger.success('Successfully validated order with external test data', testInfo);
});