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
