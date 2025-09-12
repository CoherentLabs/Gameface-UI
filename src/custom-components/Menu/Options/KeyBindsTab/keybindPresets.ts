export const PRESETS = {
  PC: {
    moveForward:"W", moveBackward:"S", moveLeft:"A", moveRight:"D",
    jump:"Space", crouch:"Ctrl", prone:"Z", sprint:"Shift", walkHold:"Alt",
    fire:"Mouse1", aimDownSights:"Mouse2", reload:"R", nextWeapon:"WheelDown", prevWeapon:"WheelUp",
    primaryWeapon:"1", secondaryWeapon:"2", quickMelee:"V", throwGrenade:"G", toggleFireMode:"B", inspectWeapon:"I",
    interact:"F", ability1:"Q", ability2:"E", ultimateAbility:"X",
    openInventory:"I", quickSlot1:"3", quickSlot2:"4", quickSlot3:"5", quickSlot4:"6", dropItem:"H",
    pushToTalk:"T", ping:"Mouse3", chat:"Enter", scoreboard:"Tab", map:"M", pauseMenu:"Esc",
  },
  Tactical: {
    // small tweaks: crouch on C, melee on F, interact on E, etc.
    moveForward:"W", moveBackward:"S", moveLeft:"A", moveRight:"D",
    jump:"Space", crouch:"C", prone:"Z", sprint:"Shift", walkHold:"Alt",
    fire:"Mouse1", aimDownSights:"Mouse2", reload:"R", nextWeapon:"WheelDown", prevWeapon:"WheelUp",
    primaryWeapon:"1", secondaryWeapon:"2", quickMelee:"F", throwGrenade:"G", toggleFireMode:"B", inspectWeapon:"I",
    interact:"E", ability1:"Q", ability2:"Mouse3", ultimateAbility:"X",
    openInventory:"I", quickSlot1:"3", quickSlot2:"4", quickSlot3:"5", quickSlot4:"6", dropItem:"H",
    pushToTalk:"T", ping:"Middle", chat:"Enter", scoreboard:"Tab", map:"M", pauseMenu:"Esc",
  },
  "Left-Handed": {
    // mirrored-ish (IJKL), tweak as you like
    moveForward:"I", moveBackward:"K", moveLeft:"J", moveRight:"L",
    jump:"Space", crouch:"RightCtrl", prone:"/", sprint:"RightShift", walkHold:"Alt",
    fire:"Mouse1", aimDownSights:"Mouse2", reload:"P", nextWeapon:"WheelDown", prevWeapon:"WheelUp",
    primaryWeapon:"7", secondaryWeapon:"8", quickMelee:";", throwGrenade:"O", toggleFireMode:"[", inspectWeapon:"]",
    interact:"'", ability1:"U", ability2:"O", ultimateAbility:"\\",
    openInventory:"Y", quickSlot1:"9", quickSlot2:"0", quickSlot3:"-", quickSlot4:"=", dropItem:"H",
    pushToTalk:"T", ping:"Mouse3", chat:"Enter", scoreboard:"Tab", map:"M", pauseMenu:"Esc",
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

