export default interface Events {
    abort?: (event: ProgressEvent) => void;
    animationend?: (event: AnimationEvent) => void;
    blur?: (event: FocusEvent) => void;
    click?: (event: MouseEvent) => void;
    dblclick?: (event: MouseEvent) => void;
    durationchange?: (event: Event) => void;
    ended?: (event: Event) => void;
    finish?: (event: AnimationPlaybackEvent) => void;
    focus?: (event: FocusEvent) => void;
    focusin?: (event: FocusEvent) => void;
    focusout?: (event: FocusEvent) => void;
    gamepadconnected?: (event: GamepadEvent) => void;
    gamepaddisconnected?: (event: GamepadEvent) => void;
    keydown?: (event: KeyboardEvent) => void;
    keypress?: (event: KeyboardEvent) => void;
    keyup?: (event: KeyboardEvent) => void;
    load?: (event: UIEvent) => void;
    mousedown?: (event: MouseEvent) => void;
    mouseenter?: (event: MouseEvent) => void;
    mouseleave?: (event: MouseEvent) => void;
    mousemove?: (event: MouseEvent) => void;
    mouseout?: (event: MouseEvent) => void;
    mouseover?: (event: MouseEvent) => void;
    mouseup?: (event: MouseEvent) => void;
    popstate?: (event: PopStateEvent) => void;
    readystatechange?: (event: Event) => void;
    resize?: (event: UIEvent) => void;
    scroll?: (event: UIEvent) => void;
    timeout?: (event: ProgressEvent) => void;
    touchend?: (event: TouchEvent) => void;
    touchmove?: (event: TouchEvent) => void;
    touchstart?: (event: TouchEvent) => void;
    transitionend?: (event: TransitionEvent) => void;
    volumechange?: (event: Event) => void;
    wheel?: (event: WheelEvent) => void;
}