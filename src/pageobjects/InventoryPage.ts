import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    readonly productContainer: Locator;
    readonly cartIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.productContainer = page.locator('.inventory_item');
        this.cartIcon = page.locator('.shopping_cart_link');
    }

    async addProductToCart(productName: string): Promise<void> {
        const product = this.productContainer.filter({ hasText: productName });
        const addButton = product.locator('button');
        await this.clickElement(addButton);
    }

    async goToCart(): Promise<void> {
        await this.clickElement(this.cartIcon);
    }
}