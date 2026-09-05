import { Page, Locator, Dialog, FrameLocator } from '@playwright/test';
import { Logger } from './Logger';

export class UIHelpers {
    /**
     * Handles native browser dialogs (Alerts, Confirms, Prompts)
     */
    static async handleDialog(page: Page, accept: boolean = true, promptText?: string): Promise<void> {
        Logger.step(`Setting up dialog listener to [${accept ? 'Accept' : 'Dismiss'}]`);
        page.once('dialog', async (dialog: Dialog) => {
            Logger.info(`Intercepted dialog [${dialog.type()}]: "${dialog.message()}"`);
            if (promptText) {
                await dialog.accept(promptText);
            } else if (accept) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
    }

    /**
     * Selects an option from a standard HTML select dropdown by visible label or value
     */
    static async selectDropdownOption(locator: Locator, option: { label?: string; value?: string }): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        if (option.label) {
            Logger.step(`Selecting dropdown option by label: ${option.label}`);
            await locator.selectOption({ label: option.label });
        } else if (option.value) {
            Logger.step(`Selecting dropdown option by value: ${option.value}`);
            await locator.selectOption({ value: option.value });
        }
    }

    /**
     * Extracts all cell texts from a dynamic web table grid
     */
    static async getTableDataAsList(rowLocator: Locator): Promise<string[]> {
        Logger.step('Extracting dynamic web table rows');
        const rows = await rowLocator.all();
        const data: string[] = [];
        for (const row of rows) {
            data.push(await row.innerText());
        }
        return data;
    }

    /**
     * Handles new window/tab opening actions
     */
    static async captureNewWindow(page: Page, triggerAction: () => Promise<void>): Promise<Page> {
        Logger.step('Capturing new window/tab transition');
        const [newWindow] = await Promise.all([
            page.context().waitForEvent('page'),
            triggerAction()
        ]);
        await newWindow.waitForLoadState();
        Logger.success('Successfully captured and switched to new window');
        return newWindow;
    }

    /**
     * Interacts with elements inside an iFrame
     */
    static getIframeContent(page: Page, frameSelector: string): FrameLocator {
        Logger.step(`Accessing iFrame content via selector: ${frameSelector}`);
        return page.frameLocator(frameSelector);
    }
}