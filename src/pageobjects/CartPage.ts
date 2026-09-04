import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly cartItem: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItem = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
    }

    async verifyProductInCart(productName: string): Promise<void> {
        const item = this.cartItem.filter({ hasText: productName });
        await expect(item).toBeVisible();
    }

    async proceedToCheckout(): Promise<void> {
        await this.clickElement(this.checkoutButton);
    }
}