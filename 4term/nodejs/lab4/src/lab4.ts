/**
 * Задача 1. Напишіть функцію, яка приймає будь-який тип масиву
 * та асинхронний колбек, який викликається для кожного елемента
 * масиву послідовно. Результатом виклику має бути масив результатів
 * колбеку. Усі типи мають застосовуватися автоматично (функція шаблону).
 */

export async function runSequent<T, R>(
    array: T[],
    callback: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];

    for (const [idx, elem] of array.entries()) {
        const result = await callback(elem, idx);
        results.push(result);
    }

    return results;
}

/**
 * Задача 2. Напишіть функцію, яка приймає будь-який тип масиву та правило
 * для видалення елементів масиву. Функція змінює переданий масив, а усі
 * видалені елементи функція повертає окремим масивом такого ж типу. Усі
 * типи мають застосовуватися автоматично (функція шаблону).
 */

export function arrayChangeDelete<T>(array: T[], predicate: (item: T) => boolean): T[] {
    const deletedElems: T[] = [];

    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            const deleted = array.splice(i, 1)[0];
            deletedElems.push(deleted);
            i--; // decrement since original array is modified
        }
    }

    return deletedElems;
}

/**
 * Задача 3. Напишіть скрипт, який отримує з командного рядка рядковий
 * параметр - шлях до JSON-файла із масивом рядків - посилань, читає та
 * аналізує його вміст. Скрипт має створити папку «<JSON_filename>_pages»
 * і для кожного посилання із JSON-файла отримати його HTML-вміст і зберегти
 * цей вміст у окремому файлі в новоствореній папці. Приклад JSON-файла
 * (list.json) прикріплений до цього практичного завдання нижче.
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as https from "https";

/**
 * @example
 * ```ts
 *  const jsonFilePath = process.argv[2];
 *  const downloader = new HTMLPageDownloader(jsonFilePath);
 *  downloader.downloadPages().catch(error => {
 *      console.error(`Error downloading pages: ${error}`);
 *  });
 * ```
 */
export class HTMLPageDownloader {
    private links: string[];
    private folderName?: string;

    constructor(jsonFilePath: string) {
        this.links = [];

        fs.readFile(jsonFilePath, "utf-8")
            .then((jsonFileContents) => {
                this.links = JSON.parse(jsonFileContents);

                // create folder `<JSON_filename>_pages`
                this.folderName =
                    path.basename(jsonFilePath, path.extname(jsonFilePath)) + "_pages";
                return fs.mkdir(this.folderName);
            })
            .catch((err) => {
                console.error(`Error reading ${jsonFilePath}: ${err}`);
            });
    }

    public async downloadPages(): Promise<void> {
        if (!this.folderName) {
            throw new Error("Folder name not initialized");
        }

        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i];
            const fileName = path.join(this.folderName, `page_${i}.html`);

            await this.downloadAndSavePage(link, fileName);
        }
    }

    private async downloadAndSavePage(link: string, fileName: string): Promise<void> {
        try {
            const response = https.get(link);
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", async () => {
                // Save the HTML content to the file
                await fs.writeFile(fileName, data);
                console.log(`Saved ${link} to ${fileName}`);
            });
        } catch (err) {
            console.error(`Error getting ${link}: ${err}`);
            throw err;
        }
    }
}

/**
 * Задача 4. Напишіть скрипт, який отримує з командного рядка числовий параметр – частоту в секундах.
 * Скрипт має виводити на кожному тику (визначеному частотою) наступну системну інформацію:
 *  - operating system;
 *  - architecture;
 *  - current user name;
 *  - cpu cores models;
 *  - cpu temperature;
 *  - graphic controllers vendors and models;
 *  - total memory, used memory, free memory в GB;
 *  - дані про батарею (charging, percent, remaining time).
 */

import * as os from "os";
import * as si from "systeminformation";

/**
 * @example
 * ```ts
 *  const frequencyInSeconds = parseInt(process.argv[2]);
 *  const systemInformation = new SystemInformation(frequencyInSeconds);
 *  systemInformation.start();
 * ```
 */
export class SystemInformation {
    private frequencyInSeconds: number;
    private interval: NodeJS.Timeout | undefined;

    constructor(frequencyInSeconds: number) {
        this.frequencyInSeconds = frequencyInSeconds;
    }

    public start() {
        this.interval = setInterval(async () => {
            const osType = os.type();
            const osArch = os.arch();
            const userName = os.userInfo().username;

            const [cpuInfo, cpuTemp, graphicsInfo, memInfo, batteryInfo] = await Promise.all([
                si.cpu(),
                si.cpuTemperature(),
                si.graphics(),
                si.mem(),
                si.battery(),
            ]);

            console.clear();

            console.log(`Operating System:\t${osType} (${osArch})`);
            console.log(`User Name:\t\t${userName}\n`);

            console.log(`CPU Info:`);
            console.log(` - Manufacturer:\t${cpuInfo.manufacturer}`);
            console.log(` - Brand:\t\t${cpuInfo.brand}`);
            console.log(
                ` - Cores:\t\t${cpuInfo.physicalCores} physical / ${cpuInfo.cores} logical`
            );
            console.log(
                ` - Clock Speed:\t\t${cpuInfo.speedMax} GHz (max) / ${cpuInfo.speed} GHz (current)`
            );
            console.log(` - Temperature:\t\t${cpuTemp.main}°C\n`);

            console.log(`Graphics Info:`);
            graphicsInfo.controllers.forEach((controller, idx) => {
                console.log(` - Controller ${idx + 1}:`);
                console.log(`    - Vendor:\t\t${controller.vendor}`);
                console.log(`    - Model:\t\t${controller.model}\n`);
            });

            console.log(`Memory Info:`);
            console.log(` - Total Memory:\t${this.toGB(memInfo.total)} GB`);
            console.log(` - Used Memory:\t\t${this.toGB(memInfo.used)} GB`);
            console.log(` - Free Memory:\t\t${this.toGB(memInfo.free)} GB\n`);

            console.log(`Battery Info:`);
            console.log(` - Charging:\t\t${batteryInfo.isCharging ? "Yes" : "No"}`);
            console.log(` - Percentage:\t\t${batteryInfo.percent}%`);
            console.log(
                ` - Remaining Time:\t${
                    batteryInfo.timeRemaining ? this.formatTime(batteryInfo.timeRemaining) : "N/A"
                }\n`
            );
        }, this.frequencyInSeconds * 1000);

        process.on("SIGINT", () => {
            this.stop();
        });
    }

    public stop() {
        clearInterval(this.interval);
        process.exit(0);
    }

    private toGB(b: number): string {
        return (b / 1024 ** 3).toFixed(2);
    }

    private formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}:${this.padZeroes(minutes)}:${this.padZeroes(remainingSeconds)}`;
    }

    private padZeroes(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }
}

/**
 * Задача 5. Напишіть власну реалізацію класу EventEmitter (Publisher/Subscriber),
 * який поводитиметься так:
 *  const emitter = new MyEventEmitter();
 *  emitter.registerHandler('userUpdated', () => console.log('Обліковий запис користувача оновлено'));
 *  emitter.emitEvent('userUpdated'); // Обліковий запис користувача оновлено
 */

type Handler = () => void;

export class MyEventEmitter {
    private handlers: Map<string, Handler[]> = new Map();

    registerHandler(eventName: string, handler: Handler) {
        const handlers = this.handlers.get(eventName) || [];
        handlers.push(handler);
        this.handlers.set(eventName, handlers);
    }

    emitEvent(eventName: string) {
        const handlers = this.handlers.get(eventName);
        if (handlers) {
            handlers.forEach((handler) => handler());
        }
    }
}
