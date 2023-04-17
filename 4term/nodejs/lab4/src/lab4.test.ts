import * as fs from "fs";
import * as path from "path";
import { runSequent, arrayChangeDelete, HTMLPageDownloader, MyEventEmitter } from "./lab4";

// task 1
describe("runSequent", () => {
    it("should return an empty array when given an empty array", async () => {
        const result = await runSequent([], async () => {});
        expect(result).toEqual([]);
    });

    it("should call the callback for each item in the array", async () => {
        const mockCallback = jest.fn();
        await runSequent([1, 2, 3], mockCallback);
        expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    it("should pass each item and its index to the callback", async () => {
        const mockCallback = jest.fn();
        await runSequent(["one", "two", "three"], mockCallback);
        expect(mockCallback).toHaveBeenNthCalledWith(1, "one", 0);
        expect(mockCallback).toHaveBeenNthCalledWith(2, "two", 1);
        expect(mockCallback).toHaveBeenNthCalledWith(3, "three", 2);
    });

    it("should return an array of results from the callback", async () => {
        const result = await runSequent([1, 2, 3], async (item, index) => item + index);
        expect(result).toEqual([1, 3, 5]);
    });
});

// task 2
describe("arrayChangeDelete", () => {
    it("should remove even numbers from an array of numbers", () => {
        const array = [1, 2, 3, 6, 7, 9];
        const expectedArray = [1, 3, 7, 9];
        const expectedDeletedElements = [2, 6];

        const deletedElements = arrayChangeDelete(array, (item) => item % 2 === 0);

        expect(array).toEqual(expectedArray);
        expect(deletedElements).toEqual(expectedDeletedElements);
    });

    it("should remove strings which contain vowels from an array of strings", () => {
        const array = ["apple", "banana", "js", "ts", "orange"];
        const expectedArray = ["js", "ts"];
        const expectedDeletedElements = ["apple", "banana", "orange"];

        const deletedElements = arrayChangeDelete(array, (item) => /[aeiou]/g.test(item));

        expect(array).toEqual(expectedArray);
        expect(deletedElements).toEqual(expectedDeletedElements);
    });
});

// task 3
const jsonFilePath = path.join(__dirname, "links.json");
const expectedFolderName = "links_pages";
const expectedFileNames = ["page_0.html", "page_1.html", "page_2.html"];

describe("HTMLPageDownloader", () => {
    let downloader: HTMLPageDownloader;

    beforeEach(() => {
        // Create a new instance of the downloader for each test
        downloader = new HTMLPageDownloader(jsonFilePath);
    });

    afterEach(() => {
        // Remove the test directory after each test
        fs.rmdirSync(expectedFolderName, { recursive: true });
    });

    describe("constructor", () => {
        it("should create the output directory", () => {
            expect(fs.existsSync(expectedFolderName)).toBe(true);
        });
    });

    describe("downloadPages", () => {
        it("should download all pages and save them to files", async () => {
            await downloader.downloadPages();

            // Check that the files were created with the correct names and content
            for (let i = 0; i < expectedFileNames.length; i++) {
                const fileName = expectedFileNames[i];
                const filePath = path.join(expectedFolderName, fileName);
                expect(fs.existsSync(filePath)).toBe(true);

                const fileContent = fs.readFileSync(filePath, "utf-8");
                expect(fileContent).toMatch(/^<!doctype html>/i);
                expect(fileContent).toMatch(/<title>Example Domain<\/title>/i);
            }
        });
    });
});

// task 5
describe("MyEventEmitter", () => {
    let emitter: MyEventEmitter;

    beforeEach(() => {
        emitter = new MyEventEmitter();
    });

    it("should register and emit a single handler", () => {
        const handler = jest.fn();
        emitter.registerHandler("userUpdated", handler);
        emitter.emitEvent("userUpdated");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should register and emit multiple handlers", () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        const handler3 = jest.fn();
        emitter.registerHandler("userUpdated", handler1);
        emitter.registerHandler("userUpdated", handler2);
        emitter.registerHandler("orderPlaced", handler3);
        emitter.emitEvent("userUpdated");
        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
        expect(handler3).toHaveBeenCalledTimes(0);
    });

    it("should not emit for unregistered event", () => {
        const handler = jest.fn();
        emitter.registerHandler("userUpdated", handler);
        emitter.emitEvent("orderPlaced");
        expect(handler).toHaveBeenCalledTimes(0);
    });

    it("should register and emit multiple events", () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        const handler3 = jest.fn();
        emitter.registerHandler("userUpdated", handler1);
        emitter.registerHandler("orderPlaced", handler2);
        emitter.registerHandler("orderPlaced", handler3);
        emitter.emitEvent("userUpdated");
        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(0);
        expect(handler3).toHaveBeenCalledTimes(0);
        emitter.emitEvent("orderPlaced");
        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
        expect(handler3).toHaveBeenCalledTimes(1);
    });
});
