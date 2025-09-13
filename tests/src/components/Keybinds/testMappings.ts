export const TEST_KEYS = [
    { action: "moveForward", key: "W" },
    { action: "moveBackward", key: "S" },
    { action: "moveLeft", key: "A" },
    { action: "moveRight", key: "D" },
    { action: "jump", key: "Space" },
    { action: "crouch", key: "Control Left" },
    { action: "sprint", key: "Shift Left" },
    { action: "fire", key: "LMB" },
    { action: "aimDownSights", key: "RMB" },
    { action: "reload", key: "R" },
];

export const ALTERNATE_KEYS = {
    moveForward: "I",
    moveBackward: "K",
    moveLeft: null,
    moveRight: "L",
    jump: "Space",
    crouch: "RightCtrl",
    sprint: "RightShift",
    fire: "Mouse1",
    aimDownSights: "Mouse2",
    reload: "P",
}