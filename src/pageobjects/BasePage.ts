import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/Logger';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string): Promise<void> {
        Logger.step(`Navigating to URL: ${url}`);
        await this.page.goto(url);
        Logger.success(`Successfully navigated to: ${url}`);
    }

    async getPageTitle(): Promise<string> {
        const title = await this.page.title();
        Logger.info(`Retrieved page title: "${title}"`);
        return title;
    }

    async waitForElementVisible(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    async clickElement(locator: Locator, elementName?: string): Promise<void> {
        await this.waitForElementVisible(locator);
        const description = elementName || 'element';
        Logger.step(`Clicking on ${description}`);
        await locator.click();
        Logger.success(`Successfully clicked on ${description}`);
    }

    async fillText(locator: Locator, text: string, fieldName?: string): Promise<void> {
        await this.waitForElementVisible(locator);
        const description = fieldName || 'input field';
        const maskedText = description.toLowerCase().includes('password') ? '********' : text;
        Logger.step(`Filling ${description} with value: "${maskedText}"`);
        await locator.fill(text);
        Logger.success(`Successfully filled ${description}`);
    }
}