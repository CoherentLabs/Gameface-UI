export interface Manifest {
    name: string,
    version?: string,
    description?: string,
    kind?: 'component' | 'lib' | 'recipe',
    'explicit-dependency'?: string[],
}

export interface ComponentData extends Partial<Manifest> {
    kind: 'component' | 'lib' | 'recipe';
    files: { path: string; hash: string }[];
    category?: string;
    dependsOn?: string[];
    npmDependencies?: string[];
}