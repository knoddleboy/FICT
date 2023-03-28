// @ts-nocheck
import { add, areAnagrams } from "./lab2";

describe("add", () => {
    it("should return a function", () => {
        expect(typeof add(1)).toBe("function");
    });

    it("should add numbers correctly", () => {
        expect(add(1)(2)()).toBe(3);
        expect(add(5)(-2)()).toBe(3);
        expect(add(2)(5)(7)(1)(6)(5)(11)()).toBe(37);
    });
});

describe("areAnagrams", () => {
    it("should return true for valid anagrams", () => {
        expect(areAnagrams("listen", "silent")).toBe(true);
        expect(areAnagrams("admirer", "married")).toBe(true);
        expect(areAnagrams("restful", "fluster")).toBe(true);
    });

    it("should return false for invalid anagrams", () => {
        expect(areAnagrams("hello", "world")).toBe(false);
        expect(areAnagrams("flower", "power")).toBe(false);
        expect(areAnagrams("program", "programmer")).toBe(false);
    });
});
