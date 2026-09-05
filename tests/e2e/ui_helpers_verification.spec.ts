import { test, expect } from '../../src/fixtures/testFixtures';
import { UIHelpers } from '../../src/utils/UIHelpers';
import { Logger } from '../../src/utils/Logger';

test.describe('UIHelpers Full Coverage Verification Suite', () => {

    test('Verify Dropdown Helper', async ({ page }, testInfo) => {
        Logger.info('Starting Dropdown UIHelper test', testInfo);
        await page.goto('https://the-internet.herokuapp.com/dropdown');
        const dropdown = page.locator('#dropdown');
        
        await UIHelpers.selectDropdownOption(dropdown, { label: 'Option 1' });
        await expect(dropdown).toHaveValue('1');
        Logger.success('Dropdown helper verified successfully', testInfo);
    });

    test('Verify Dialog / Alert Helper', async ({ page }, testInfo) => {
        Logger.info('Starting Alert Dialog UIHelper test', testInfo);
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
        
        await UIHelpers.handleDialog(page, true);
        await page.click('text=Click for JS Alert');
        
        await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
        Logger.success('Alert dialog helper verified successfully', testInfo);
    });

    test('Verify Web Table Data Extraction Helper', async ({ page }, testInfo) => {
        Logger.info('Starting Web Table UIHelper test', testInfo);
        await page.goto('https://the-internet.herokuapp.com/tables');
        
        const rowLocator = page.locator('#table1 tbody tr');
        const tableData = await UIHelpers.getTableDataAsList(rowLocator);
        
        expect(tableData.length).toBeGreaterThan(0);
        Logger.success(`Extracted ${tableData.length} rows from table successfully`, testInfo);
    });

    test('Verify New Window Capture Helper', async ({ page }, testInfo) => {
        Logger.info('Starting New Window UIHelper test', testInfo);
        await page.goto('https://the-internet.herokuapp.com/windows');
        
        const newWindow = await UIHelpers.captureNewWindow(page, async () => {
            await page.click('text=Click Here');
        });
        
        await expect(newWindow.locator('h3')).toHaveText('New Window');
        Logger.success('New window capture helper verified successfully', testInfo);
        await newWindow.close();
    });

});