/**
 * Задача 1. Напишіть функцію add(), яка приймає будь-яку
 * кількість параметрів у такому вигляді:
 * console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37
 */

export function add(num?: number) {
    let sum = num ?? 0;

    function accum(next?: number) {
        if (next) {
            sum += next;
            return accum;
        }

        return sum as number & (() => number);
    }

    return accum;
}

/**
 * Задача 2. Напишіть функцію, яка бере два рядки і повертає true,
 * якщо вони є анаграмами одне одного.
 */

export function areAnagrams(s1: string, s2: string): boolean {
    // false, if strings are different sizes
    if (s1.length !== s2.length) {
        return false;
    }

    const lS1 = s1.toLowerCase();
    const lS2 = s2.toLowerCase();

    const sortedS1 = lS1.split("").sort().join("");
    const sortedS2 = lS2.split("").sort().join("");

    return sortedS1 === sortedS2;
}
