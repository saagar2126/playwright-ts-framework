import * as fs from 'fs';
import * as path from 'path';

export class TestDataManager {
    private static instance: TestDataManager;
    private testData: Record<string, any> = {};

    private constructor() {
        this.loadTestData();
    }

    public static getInstance(): TestDataManager {
        if (!TestDataManager.instance) {
            TestDataManager.instance = new TestDataManager();
        }
        return TestDataManager.instance;
    }

    private loadTestData(): void {
       const possiblePaths = [
            path.resolve(process.cwd(), 'src/testdata/testdata.json'),
            path.resolve(process.cwd(), 'src/testdata/testData.json'),
            path.resolve(__dirname, '../testdata/testdata.json'),
            path.resolve(__dirname, '../testdata/testData.json'),
            path.resolve(__dirname, '../../src/testdata/testdata.json'),
            path.resolve(process.cwd(), 'dist/testdata/testdata.json')
        ];

        let filePath = '';
        let rawFile = '';
        let loaded = false;

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                rawFile = fs.readFileSync(filePath, 'utf-8');
                loaded = true;
                break;
            }
        }

        if (!loaded) {
            throw new Error(`Failed to locate testData.json. Searched paths: ${possiblePaths.join(', ')}`);
        }

        try {
            this.testData = JSON.parse(rawFile);
        } catch (error) {
            throw new Error(`Failed to parse test data JSON from path: ${filePath}. Error: ${error}`);
        }
    }

    public getDataset(datasetKey: string): any {
        if (!this.testData[datasetKey]) {
            throw new Error(`Dataset key "${datasetKey}" not found in testData.json`);
        }
        return this.testData[datasetKey];
    }
}