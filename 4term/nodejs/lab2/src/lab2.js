/**
 * Задача 1. Напишіть функцію add(), яка приймає будь-яку
 * кількість параметрів у такому вигляді:
 * console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37
 */

export function add(num) {
    let sum = num ?? 0;

    function accum(next) {
        if (next) {
            sum += next;
            return accum;
        }

        return sum;
    }

    return accum;
}

/**
 * Задача 2. Напишіть функцію, яка бере два рядки і повертає true,
 * якщо вони є анаграмами одне одного.
 */

export function areAnagrams(s1, s2) {
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

/**
 * Задача 3. Напишіть функцію, яка глибоко клонує об'єкт, переданий їй параметром.
 */

export function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    // in case an object's value is an array
    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item));
    }

    const clone = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            clone[key] = deepClone(value);
        }
    }

    return clone;
}

/**
 * Задача 4. Напишіть функцію-обгортку, яка кешуватиме результат будь-якої
 * іншої функції з довільною кількістю параметрів.
 */

export function cacheWrapper(fn) {
    const cache = new Map();

    return function (...args) {
        const cachedArgs = JSON.stringify(args);

        // if exists, return cached result for args
        if (cache.has(cachedArgs)) {
            return cache.get(cachedArgs);
        }

        const result = fn(...args);
        cache.set(cachedArgs, result); // save result for provided args

        return result;
    };
}
