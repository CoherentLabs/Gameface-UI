const codeToChar: Record<string, string> = {
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",

    // Numpad operators
    NumpadAdd: "+",
    NumpadSubtract: "-",
    NumpadMultiply: "*",
    NumpadDivide: "/",
    NumpadDecimal: ".",
    NumpadComma: ",",

    Escape: "Esc",
    ShiftLeft: "L Shift",
    ShiftRight: "R Shift",
    ControlLeft: "L Ctrl",
    ControlRight: "R Ctrl",
    AltLeft: "L Alt",
    AltRight: "R Alt",
    MetaLeft: "L Meta",
    MetaRight: "R Meta",

    // Other special keys
    Tab: "Tab",
    CapsLock: "Caps",
    Space: "Space",
    Enter: "Enter",
    Backspace: "Back",
    Delete: "Del",
    Insert: "Ins",
    Home: "Home",
    End: "End",
    PageUp: "PgUp",
    PageDown: "PgDn",

    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",

    PrintScreen: "PrtSc",
    ScrollLock: "Scroll",
    Pause: "Pause",
    ContextMenu: "Menu",
};

export default codeToChar;