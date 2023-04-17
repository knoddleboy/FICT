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

    array.forEach(async (elem, idx) => {
        const result = await callback(elem, idx);
        results.push(result);
    });

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

import * as fs from "fs";
import * as path from "path";
import * as https from "https";

export class HTMLPageDownloader {
    private links: string[];
    private folderName: string;

    constructor(jsonFilePath: string) {
        const jsonFileContents = fs.readFileSync(jsonFilePath, "utf-8");
        this.links = JSON.parse(jsonFileContents);

        // create folder `<JSON_filename>_pages`
        this.folderName = path.basename(jsonFilePath, path.extname(jsonFilePath)) + "_pages";
        fs.mkdirSync(this.folderName);
    }

    public async downloadPages(): Promise<void> {
        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i];
            const fileName = path.join(this.folderName, `page_${i}.html`);

            await this.downloadAndSavePage(link, fileName);
        }
    }

    private async downloadAndSavePage(link: string, fileName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            https
                .get(link, (res) => {
                    let data = "";

                    res.on("data", (chunk) => {
                        data += chunk;
                    });

                    res.on("end", () => {
                        // Save the HTML content to the file
                        fs.writeFileSync(fileName, data);
                        console.log(`Saved ${link} to ${fileName}`);
                        resolve();
                    });
                })
                .on("error", (err) => {
                    console.error(`Error getting ${link}: ${err}`);
                    reject(err);
                });
        });
    }
}
