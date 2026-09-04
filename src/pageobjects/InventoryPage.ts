import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UIHelpers } from '../utils/UIHelpers';

export class InventoryPage extends BasePage {
    readonly productSortDropdown: Locator;
    readonly inventoryItems: Locator;
    readonly cartIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.productSortDropdown = page.locator('[data-test="product-sort-container"]');
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    }

    async sortProductsBy(visibleLabel: string): Promise<void> {
        await UIHelpers.selectDropdownOption(this.productSortDropdown, { label: visibleLabel });
    }

    async addProductToCart(productName: string): Promise<void> {
        const item = this.inventoryItems.filter({ hasText: productName });
        const addBtn = item.locator('button');
        await this.clickElement(addBtn);
    }

    async getInventoryPrices(): Promise<number[]> {
        const priceLocators = this.page.locator('[data-test="inventory-item-price"]');
        const priceTexts = await priceLocators.allInnerTexts();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    async goToCart(): Promise<void> {
        await this.clickElement(this.cartIcon);
    }
}