// @ts-nocheck
import { add } from "./lab2";

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
