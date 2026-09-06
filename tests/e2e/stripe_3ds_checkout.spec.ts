import { test, expect } from '../../src/fixtures/testFixtures';
import { TestDataManager } from '../../src/utils/TestDataManager';
import { Logger } from '../../src/utils/Logger';

// Import just the component directly
import { CreditCardPayment } from '../../src/components/CreditCardPayment';

test('Verify 3D Secure checkout flow using standalone Component', async ({ page }, testInfo) => {
    // 1. Get test data
    const testData = TestDataManager.getInstance().getDataset('stripeDemo3DS');
    Logger.info('Starting external 3DS checkout flow demo', testInfo);

    await page.goto(testData.endpoint);

    // 2. Initialize the Component and process payment directly
    const paymentComponent = new CreditCardPayment(testData.payment);
    await paymentComponent.processPayment(page);

   // 3. Verify Success using an XPath locator
const successBanner = page.locator("//div[@class='status success']");
await expect(successBanner).toContainText('Thanks for your order!');
    
    Logger.success('3DS payment and order confirmation verified successfully', testInfo);
});