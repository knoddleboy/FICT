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
