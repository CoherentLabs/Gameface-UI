export const PRESETS = {
  Default: {
    moveForward: "W", moveBackward: "S", moveLeft: "A", moveRight: "D",
    jump: "Space", crouch: "L Ctrl", prone: "Z", sprint: "L Shift", walkHold: "L Alt",
    fire: "Mouse Left", aimDownSights: "Mouse Right", reload: "R", nextWeapon: "Wheel Down", prevWeapon: "Wheel Up",
    primaryWeapon: "1", secondaryWeapon: "2", quickMelee: "V", throwGrenade: "G", toggleFireMode: "B", inspectWeapon: "I",
    interact: "F", ability1: "Q", ability2: "E", ultimateAbility: "X",
    openInventory: "I", quickSlot1: "3", quickSlot2: "4", quickSlot3: "5", quickSlot4: "6", dropItem: "H",
    pushToTalk: "T", ping: "MMB", chat: "Enter", scoreboard: "Tab", map: "M", pauseMenu: "Esc",
  },
  Tactical: {
    moveForward: "W", moveBackward: "S", moveLeft: "A", moveRight: "D",
    jump: "Space", crouch: "C", prone: "Z", sprint: "L Shift", walkHold: "L Alt",
    fire: "Mouse Left", aimDownSights: "Mouse Right", reload: "R", nextWeapon: "Wheel Down", prevWeapon: "Wheel Up",
    primaryWeapon: "1", secondaryWeapon: "2", quickMelee: "F", throwGrenade: "G", toggleFireMode: "B", inspectWeapon: "I",
    interact: "E", ability1: "Q", ability2: "MMB", ultimateAbility: "X",
    openInventory: "I", quickSlot1: "3", quickSlot2: "4", quickSlot3: "5", quickSlot4: "6", dropItem: "H",
    pushToTalk: "T", ping: "MMB", chat: "Enter", scoreboard: "Tab", map: "M", pauseMenu: "Esc",
  },
  "Left-Handed": {
    moveForward: "I", moveBackward: "K", moveLeft: "J", moveRight: "L",
    jump: "Space", crouch: "R Ctrl", prone: "/", sprint: "R Shift", walkHold: "L Alt",
    fire: "Mouse Left", aimDownSights: "Mouse Right", reload: "P", nextWeapon: "Wheel Down", prevWeapon: "Wheel Up",
    primaryWeapon: "7", secondaryWeapon: "8", quickMelee: ";", throwGrenade: "O", toggleFireMode: "[", inspectWeapon: "]",
    interact: "'", ability1: "U", ability2: "O", ultimateAbility: "\\",
    openInventory: "Y", quickSlot1: "9", quickSlot2: "0", quickSlot3: "-", quickSlot4: "=", dropItem: "H",
    pushToTalk: "T", ping: "MMB", chat: "Enter", scoreboard: "Tab", map: "M", pauseMenu: "Esc",
  },
};

export const PRESETS_GAMEPAD = {
  Default: {
    moveForward: "left.joystick.up", moveBackward: "left.joystick.down", moveLeft: "left.joystick.left", moveRight: "left.joystick.right",
    jump: "xbox.a", crouch: "xbox.b", prone: "xbox.d-pad-down", sprint: "xbox.left-thumbstick", walkHold: null,
    fire: "xbox.rt", aimDownSights: "xbox.lt", reload: "xbox.x", nextWeapon: "xbox.y", prevWeapon: "xbox.d-pad-up",
    primaryWeapon: null, secondaryWeapon: null, quickMelee: "xbox.right-thumbstick", throwGrenade: "xbox.lb", toggleFireMode: "xbox.d-pad-left", inspectWeapon: null,
    interact: "xbox.x", ability1: "xbox.rb", ability2: "xbox.lb", ultimateAbility: null,
    openInventory: "xbox.view", quickSlot1: null, quickSlot2: null, quickSlot3: null, quickSlot4: null, dropItem: null,
    pushToTalk: null, ping: "xbox.d-pad-right", chat: null, scoreboard: "xbox.view", map: "xbox.view", pauseMenu: "xbox.menu",
  },
  Tactical: {
    moveForward: "left.joystick.up", moveBackward: "left.joystick.down", moveLeft: "left.joystick.left", moveRight: "left.joystick.right",
    jump: "xbox.a", crouch: "xbox.right-thumbstick", prone: "xbox.d-pad-down", sprint: "xbox.left-thumbstick", walkHold: null,
    fire: "xbox.rt", aimDownSights: "xbox.lt", reload: "xbox.x", nextWeapon: "xbox.y", prevWeapon: "xbox.d-pad-up",
    primaryWeapon: null, secondaryWeapon: null, quickMelee: "xbox.b", throwGrenade: "xbox.lb", toggleFireMode: "xbox.d-pad-left", inspectWeapon: null,
    interact: "xbox.x", ability1: "xbox.rb", ability2: "xbox.lb", ultimateAbility: null,
    openInventory: "xbox.view", quickSlot1: null, quickSlot2: null, quickSlot3: null, quickSlot4: null, dropItem: null,
    pushToTalk: null, ping: "xbox.d-pad-right", chat: null, scoreboard: "xbox.view", map: "xbox.view", pauseMenu: "xbox.menu",
  },
  "Left-Handed": {
    moveForward: "left.joystick.up", moveBackward: "left.joystick.down", moveLeft: "left.joystick.left", moveRight: "left.joystick.right",
    jump: "xbox.lb", crouch: "xbox.b", prone: "xbox.d-pad-down", sprint: "xbox.left-thumbstick", walkHold: null,
    fire: "xbox.rt", aimDownSights: "xbox.lt", reload: "xbox.x", nextWeapon: "xbox.y", prevWeapon: "xbox.d-pad-up",
    primaryWeapon: null, secondaryWeapon: null, quickMelee: "xbox.right-thumbstick", throwGrenade: "xbox.a", toggleFireMode: "xbox.d-pad-left", inspectWeapon: null,
    interact: "xbox.x", ability1: "xbox.rb", ability2: "xbox.a", ultimateAbility: null,
    openInventory: "xbox.view", quickSlot1: null, quickSlot2: null, quickSlot3: null, quickSlot4: null, dropItem: null,
    pushToTalk: null, ping: "xbox.d-pad-right", chat: null, scoreboard: "xbox.view", map: "xbox.view", pauseMenu: "xbox.menu",
  },
};

export const ROWS = [
  // Movement
  { id: "moveForward", name: "Move Forward" },
  { id: "moveBackward", name: "Move Backward" },
  { id: "moveLeft", name: "Move Left" },
  { id: "moveRight", name: "Move Right" },
  { id: "jump", name: "Jump" },
  { id: "crouch", name: "Crouch" },
  { id: "prone", name: "Prone" },
  { id: "sprint", name: "Sprint" },
  { id: "walkHold", name: "Walk (Hold)" },

  // Combat
  { id: "fire", name: "Fire" },
  { id: "aimDownSights", name: "Aim Down Sights" },
  { id: "reload", name: "Reload" },
  { id: "nextWeapon", name: "Next Weapon" },
  { id: "prevWeapon", name: "Previous Weapon" },
  { id: "primaryWeapon", name: "Primary Weapon" },
  { id: "secondaryWeapon", name: "Secondary Weapon" },
  { id: "quickMelee", name: "Quick Melee" },
  { id: "throwGrenade", name: "Throw Grenade" },
  { id: "toggleFireMode", name: "Toggle Fire Mode" },
  { id: "inspectWeapon", name: "Inspect Weapon" },

  // Abilities / Interact
  { id: "interact", name: "Interact / Use" },
  { id: "ability1", name: "Ability 1" },
  { id: "ability2", name: "Ability 2" },
  { id: "ultimateAbility", name: "Ultimate / Special" },

  // Inventory / Quick slots
  { id: "openInventory", name: "Open Inventory" },
  { id: "quickSlot1", name: "Quick Slot 1" },
  { id: "quickSlot2", name: "Quick Slot 2" },
  { id: "quickSlot3", name: "Quick Slot 3" },
  { id: "quickSlot4", name: "Quick Slot 4" },
  { id: "dropItem", name: "Drop Item" },

  // Communication / UI
  { id: "pushToTalk", name: "Push-to-Talk" },
  { id: "ping", name: "Ping / Mark" },
  { id: "chat", name: "Text Chat" },
  { id: "scoreboard", name: "Scoreboard" },
  { id: "map", name: "Map" },
  { id: "pauseMenu", name: "Pause / Menu" },
] as const;

