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
        const filePath = path.resolve(process.cwd(), 'src/testdata/testData.json');
        try {
            const rawFile = fs.readFileSync(filePath, 'utf-8');
            this.testData = JSON.parse(rawFile);
        } catch (error) {
            throw new Error(`Failed to load test data from path: ${filePath}. Error: ${error}`);
        }
    }

    public getDataset(datasetKey: string): any {
        if (!this.testData[datasetKey]) {
            throw new Error(`Dataset key "${datasetKey}" not found in testData.json`);
        }
        return this.testData[datasetKey];
    }
}