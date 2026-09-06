import { Page,expect } from '@playwright/test';
import { Logger } from '../utils/Logger';

export class CreditCardPayment {
    private details: any;

    constructor(details: any) {
        this.details = details;
    }

    async processPayment(page: Page): Promise<void> {
        Logger.step('Accessing Stripe Card iFrame from Component');
        const cardFrame = page.frameLocator(this.details.paymentFrameSelector);
        
        Logger.step('Filling credit card details inside iFrame');
        const cardNumberInput = cardFrame.locator('input[name="cardnumber"]');
        await page.waitForTimeout(1000);
        await cardNumberInput.fill(this.details.cardNumber);
        
        await cardFrame.locator('input[name="exp-date"]').fill(this.details.expiry);
        await cardFrame.locator('input[name="cvc"]').fill(this.details.cvc);
        
        // Give Stripe's internal JS a brief moment to validate the card string
        await page.waitForTimeout(500);

        Logger.step('Filling billing details on main page');
        await page.locator('input[name="name"]').fill(this.details.name);
        await page.locator('input[name="email"]').fill(this.details.email);
        await page.locator('input[name="address"]').fill(this.details.address);
        await page.locator('input[name="city"]').fill(this.details.city);
        await page.locator('input[name="state"]').fill(this.details.state);
        await page.locator('input[name="postal_code"]').fill(this.details.zip);

        Logger.step('Filling billing details on main page');
        const zipLocator = page.locator('fieldset').locator('input[name="zip"], input[name="postal"], #zip, #postal-code').first();
        if (await zipLocator.isVisible()) {
            await zipLocator.fill(this.details.zip);
        }
        
       Logger.step('Submitting Payment');
        const payButton = page.locator('button[type="submit"], button:has-text("Pay")').first();
        await payButton.waitFor({ state: 'visible', timeout: 5000 });
        
        // Ensure the button is enabled and not stuck in a "Processing..." state
        await expect(payButton).toBeEnabled({ timeout: 5000 });

        if (this.details.is3DSecure) {
            Logger.step('Submitting Payment and awaiting 3DS challenge frame');
            
            // Trigger the payment and ensure we wait for the action to register
            await payButton.click();

            // Then chain down to the challenge frame once visible
            const outerFrame = page.frameLocator('iframe[src*="three-ds-2-challenge"]');
            const innerFrame = outerFrame.frameLocator('#challengeFrame');
            const authButton = innerFrame.locator('#test-source-authorize-3ds');
            
            await authButton.waitFor({ state: 'visible', timeout: 30000 });
            await authButton.click();
            
            Logger.success('3DS challenge authorization submitted via component');
        } else {
            await payButton.click();
        }
    }
}