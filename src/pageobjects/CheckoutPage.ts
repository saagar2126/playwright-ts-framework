import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly orderCompleteHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.postalCodeInput = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.finishButton = page.locator('#finish');
        this.orderCompleteHeader = page.locator('.complete-header');
    }

    async fillCustomerDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.fillText(this.firstNameInput, firstName);
        await this.fillText(this.lastNameInput, lastName);
        await this.fillText(this.postalCodeInput, postalCode);
        await this.clickElement(this.continueButton);
    }

    async completeOrder(): Promise<void> {
        await this.clickElement(this.finishButton);
    }
}