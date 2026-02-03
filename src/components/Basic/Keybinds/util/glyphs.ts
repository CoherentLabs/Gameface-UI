import { Icon } from "@components/Media/Icon/Icon";
import { GamepadMappings } from "coherent-gameface-interaction-manager";
import { Component, JSX } from "solid-js";

/**
 * Maps standard Gamepad API button indices to Gameface-ui Icon components.
 * [Reference](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API#button_layout)
 */
export const GLYPHS = {
    // Face Buttons
    '0': Icon.gamepad.xbox.a,
    '1': Icon.gamepad.xbox.b,
    '2': Icon.gamepad.xbox.x,
    '3': Icon.gamepad.xbox.y,

    // Shoulder Buttons (Bumpers)
    '4': Icon.gamepad.xbox.lb,
    '5': Icon.gamepad.xbox.rb,

    // Triggers
    '6': Icon.gamepad.xbox.lt,
    '7': Icon.gamepad.xbox.rt,

    // Navigation / Center Buttons
    '8': Icon.gamepad.xbox.view,  // Often used as 'Back' or 'Select'
    '9': Icon.gamepad.xbox.menu,  // Often used as 'Start'
    
    // Stick Presses (L3 / R3)
    '10': Icon.gamepad.xbox.leftStickPress,
    '11': Icon.gamepad.xbox.rightStickPress,

    // D-Pad
    '12': Icon.gamepad.xbox.dpadUp,
    '13': Icon.gamepad.xbox.dpadDown,
    '14': Icon.gamepad.xbox.dpadLeft,
    '15': Icon.gamepad.xbox.dpadRight,

    // Additional Button (Xbox Guide/Share)
    '16': Icon.gamepad.xbox.share,

    'right.joystick': Icon.gamepad.xbox.rightStick,
    'left.joystick': Icon.gamepad.xbox.leftStick,
    'left.joystick.down': Icon.gamepad.xbox.leftStick,
    'left.joystick.up': Icon.gamepad.xbox.leftStick,
    'left.joystick.left': Icon.gamepad.xbox.leftStick,
    'left.joystick.right': Icon.gamepad.xbox.leftStick,
    'right.joystick.down': Icon.gamepad.xbox.rightStick,
    'right.joystick.up': Icon.gamepad.xbox.rightStick,
    'right.joystick.left': Icon.gamepad.xbox.rightStick,
    'right.joystick.right': Icon.gamepad.xbox.rightStick
};

export type GamepadBindingCode = keyof typeof GLYPHS;
export type GlyphOverrides = Partial<Record<GamepadBindingCode, Component<any> | JSX.Element>>;