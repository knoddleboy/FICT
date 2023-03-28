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
