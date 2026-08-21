function normalizeIconKey(name: string, file: string) {
    const key = name
        .replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
        .replace(/^[A-Z]/, (c) => c.toLowerCase());

    if (key === '') {
        throw new Error(
            `Icon "${file}" has no usable name: it contains no letters or digits. ` +
            `Rename it to something like "myIcon.svg".`
        );
    }

    if (/^[0-9]/.test(key)) {
        throw new Error(
            `Icon "${file}" produces the key "${key}", which starts with a digit — ` +
            `<Icon.${key} /> is not valid syntax. Rename it to start with a letter, e.g. "icon${key}.svg".`
        );
    }
    return key;
}

export default normalizeIconKey;