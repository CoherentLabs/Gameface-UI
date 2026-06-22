export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (this: ThisParameterType<T>, ...args: Parameters<T>): void;
    cancel: () => void;
}

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): DebouncedFunction<T> => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    } as DebouncedFunction<T>;

    debounced.cancel = () => {
        clearTimeout(timeout);
        timeout = undefined;
    };

    return debounced;
}
