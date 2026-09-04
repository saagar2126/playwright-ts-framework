import { Page, Locator } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async waitForElementVisible(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    async clickElement(locator: Locator): Promise<void> {
        await this.waitForElementVisible(locator);
        await locator.click();
    }

    async fillText(locator: Locator, text: string): Promise<void> {
        await this.waitForElementVisible(locator);
        await locator.fill(text);
    }
}