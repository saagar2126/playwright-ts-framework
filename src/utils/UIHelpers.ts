import { Page, Locator, Dialog } from '@playwright/test';

export class UIHelpers {
    /**
     * Handles native browser dialogs (Alerts, Confirms, Prompts)
     */
    static async handleDialog(page: Page, accept: boolean = true, promptText?: string): Promise<void> {
        page.once('dialog', async (dialog: Dialog) => {
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
            await locator.selectOption({ label: option.label });
        } else if (option.value) {
            await locator.selectOption({ value: option.value });
        }
    }

    /**
     * Extracts all cell texts from a dynamic web table grid
     */
    static async getTableDataAsList(rowLocator: Locator): Promise<string[]> {
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
        const [newWindow] = await Promise.all([
            page.context().waitForEvent('page'),
            triggerAction()
        ]);
        await newWindow.waitForLoadState();
        return newWindow;
    }
}