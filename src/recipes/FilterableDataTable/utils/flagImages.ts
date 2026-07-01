const flagModules = import.meta.glob('@assets/icons/flags/*.svg', { eager: true }) as Record<string, { default: string }>;
const FLAG_SRC: Record<string, string> = {};
for (const path in flagModules) {
    const code = path.slice(path.lastIndexOf('/') + 1).replace('.svg', '');
    FLAG_SRC[code] = flagModules[path].default;
}

export default FLAG_SRC;