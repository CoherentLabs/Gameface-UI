import Image from '@components/Media/Image/Image';
import { Component, JSX } from "solid-js";

/**
 * Maps standard Gamepad API button indices to Gameface-ui Icon components.
 * [Reference](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API#button_layout)
 */
export const GLYPHS = {
    // Face Buttons
    '0': Image.icons.gamepad.xbox.a,
    '1': Image.icons.gamepad.xbox.b,
    '2': Image.icons.gamepad.xbox.x,
    '3': Image.icons.gamepad.xbox.y,

    // Shoulder Buttons (Bumpers)
    '4': Image.icons.gamepad.xbox.lb,
    '5': Image.icons.gamepad.xbox.rb,

    // Triggers
    '6': Image.icons.gamepad.xbox.lt,
    '7': Image.icons.gamepad.xbox.rt,

    // Navigation / Center Buttons
    '8': Image.icons.gamepad.xbox.view,  // Often used as 'Back' or 'Select'
    '9': Image.icons.gamepad.xbox.menu,  // Often used as 'Start'
    
    // Stick Presses (L3 / R3)
    '10': Image.icons.gamepad.xbox.leftStickPress,
    '11': Image.icons.gamepad.xbox.rightStickPress,

    // D-Pad
    '12': Image.icons.gamepad.xbox.dpadUp,
    '13': Image.icons.gamepad.xbox.dpadDown,
    '14': Image.icons.gamepad.xbox.dpadLeft,
    '15': Image.icons.gamepad.xbox.dpadRight,

    // Additional Button (Xbox Guide/Share)
    '16': Image.icons.gamepad.xbox.share,

    'right.joystick': Image.icons.gamepad.xbox.rightStick,
    'left.joystick': Image.icons.gamepad.xbox.leftStick,
    'left.joystick.down': Image.icons.gamepad.xbox.leftStick,
    'left.joystick.up': Image.icons.gamepad.xbox.leftStick,
    'left.joystick.left': Image.icons.gamepad.xbox.leftStick,
    'left.joystick.right': Image.icons.gamepad.xbox.leftStick,
    'right.joystick.down': Image.icons.gamepad.xbox.rightStick,
    'right.joystick.up': Image.icons.gamepad.xbox.rightStick,
    'right.joystick.left': Image.icons.gamepad.xbox.rightStick,
    'right.joystick.right': Image.icons.gamepad.xbox.rightStick
};

export type GamepadBindingCode = keyof typeof GLYPHS;
export type GlyphOverrides = Partial<Record<GamepadBindingCode, Component<any> | JSX.Element>>;