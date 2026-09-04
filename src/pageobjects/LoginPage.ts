import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goTo(): Promise<void> {
        await this.navigateTo('https://www.saucedemo.com/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.fillText(this.usernameInput, username, 'Username Field');
        await this.fillText(this.passwordInput, password, 'Password Field');
        await this.clickElement(this.loginButton, 'Login Button');
    }
}