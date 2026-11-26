/** A named part of a component: a `createTokenComponent` token, or another export placed inside it. */
export interface EditorSlot {
    /** Name shown in Layers and the right panel. */
    name: string,
    /** JSX tag the editor writes, as a path on the component's default export (`Dropdown.Option`). */
    token: string,
    /** Module (relative to the component folder) when the tag isn't on the default export: `./Keybind`, `./State#Match`. */
    import?: string,
    /** Styled from the right panel; default true. */
    styleable?: boolean,
    /** The designer can drop elements inside it. */
    acceptsChildren?: boolean,
    /** Appears any number of times (options, items); otherwise at most once. */
    repeat?: boolean,
    /** Renders no box of its own; the canvas selects its children. */
    wrapper?: boolean,
    focusable?: boolean,
    textProp?: string,
    propsOrder?: string[],
    hiddenProps?: string[],
    slots?: EditorSlot[],
    children?: EditorChildren,
}

export interface EditorChildren {
    /** Tags that can be added as direct children: own tokens, other library components, or `*` for any element. */
    accepts: string[],
    /** Label of the Layers "+" action that adds the first accepted tag. */
    addLabel?: string,
}

/** A ready-made form of the component listed as its own tile (`Progress.Bar`, `Chart.Pie`, `Column.Four`). */
export interface EditorVariant {
    name: string,
    token: string,
    icon?: string,
    /** Used instead of the component's when the root is only a namespace (`Chart`, `Progress`). */
    propsOrder?: string[],
    hiddenProps?: string[],
    slots?: EditorSlot[],
    children?: EditorChildren,
}

/** The `editor` block of a manifest (D-27). Anything TypeScript already says is not repeated here. */
export interface EditorMeta {
    /** Not listed in the Components panel (hooks, internals). Every other field is then ignored. */
    hidden?: boolean,
    /** Entry file, relative to the component folder, when it isn't `<Folder>.tsx`. */
    entry?: string,
    icon?: string,
    /** Components panel group; defaults to the top-level folder. */
    category?: string,
    /** Renders no box of its own (providers, passthroughs); the canvas selects its children. */
    wrapper?: boolean,
    /** Only valid somewhere inside one of these components. */
    within?: string[],
    slots?: EditorSlot[],
    children?: EditorChildren,
    variants?: EditorVariant[],
    propsOrder?: string[],
    hiddenProps?: string[],
    /**
     * Props that are size presets (`Button.size`, `ColorPicker.size`). Size modes themselves come from the
     * element's parent (14 Canvas §10); a W/H edit overrides these props and the editor marks them overridden.
     */
    sizeProps?: string[],
    handles?: { rotate?: boolean, radius?: boolean },
    focusable?: boolean,
    textProp?: string,
}

export interface Manifest {
    name: string,
    version?: string,
    description?: string,
    kind?: 'component' | 'lib' | 'recipe',
    'explicit-dependency'?: string[],
    editor?: EditorMeta,
}

export interface ComponentData extends Partial<Manifest> {
    kind: 'component' | 'lib' | 'recipe';
    files: { path: string; hash: string }[];
    category?: string;
    dependsOn?: string[];
    npmDependencies?: string[];
}
