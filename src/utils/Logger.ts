import { TestInfo } from '@playwright/test';

export class Logger {
    private static formatPrefix(testInfo?: TestInfo, level: string = 'INFO'): string {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
        const workerId = testInfo ? `[Worker-${testInfo.workerIndex}]` : '[Worker-Main]';
        return `${timestamp} ${workerId} [${level}] ➔`;
    }

    public static info(message: string, testInfo?: TestInfo): void {
        console.log(`${this.formatPrefix(testInfo, 'INFO')} ${message}`);
    }

    public static step(message: string, testInfo?: TestInfo): void {
        console.log(`${this.formatPrefix(testInfo, 'STEP')} ${message}`);
    }

    public static success(message: string, testInfo?: TestInfo): void {
        console.log(`${this.formatPrefix(testInfo, 'SUCCESS')} ${message}`);
    }

    public static error(message: string, testInfo?: TestInfo): void {
        console.error(`${this.formatPrefix(testInfo, 'ERROR')} ${message}`);
    }
}