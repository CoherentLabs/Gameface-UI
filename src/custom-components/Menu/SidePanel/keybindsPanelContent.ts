export const keybindsPanelContent: Record<string, { title: string; content: string }> = {
  // ---- Preset / global ----
  keybindPreset: {
    title: "Keybind Preset",
    content:
      "Select a starting layout for common shooter controls:"
  },

  // ---- Movement ----
  moveForward: { title: "Move Forward", content: "Walk forward. Default: W." },
  moveBackward: { title: "Move Backward", content: "Walk backward. Default: S." },
  moveLeft: { title: "Move Left", content: "Strafe left. Default: A." },
  moveRight: { title: "Move Right", content: "Strafe right. Default: D." },
  jump: { title: "Jump", content: "Jump or mantle. Default: Space." },
  crouch: {
    title: "Crouch",
    content: "Lower stance for accuracy/cover. Often paired with a Toggle/Hold option.",
  },
  prone: {
    title: "Prone",
    content: "Go fully prone if supported. Slower, smaller target, better recoil control.",
  },
  sprint: { title: "Sprint", content: "Move faster while held; may reduce accuracy." },
  walkHold: {
    title: "Walk (Hold)",
    content: "Temporarily slow movement for stealth/precision aim.",
  },

  // ---- Combat ----
  fire: { title: "Fire", content: "Primary fire. Mouse1 by default." },
  aimDownSights: {
    title: "Aim Down Sights",
    content: "ADS for tighter spread/zoom. Often has Toggle/Hold behavior.",
  },
  reload: { title: "Reload", content: "Reload current weapon. Default: R." },
  nextWeapon: { title: "Next Weapon", content: "Cycle to the next weapon. Mouse wheel down by default." },
  prevWeapon: { title: "Previous Weapon", content: "Cycle to the previous weapon. Mouse wheel up by default." },
  primaryWeapon: { title: "Primary Weapon", content: "Direct select primary slot. Default: 1." },
  secondaryWeapon: { title: "Secondary Weapon", content: "Direct select sidearm/secondary. Default: 2." },
  quickMelee: { title: "Quick Melee", content: "Fast melee attack without swapping weapons. Default: V." },
  throwGrenade: { title: "Throw Grenade", content: "Lob equipped grenade. Default: G." },
  toggleFireMode: {
    title: "Toggle Fire Mode",
    content: "Switch between semi/burst/auto if the weapon supports it.",
  },
  inspectWeapon: { title: "Inspect Weapon", content: "Admire the gun. Pure swagger, zero gameplay effect." },

  // ---- Abilities / Interact ----
  interact: { title: "Interact / Use", content: "Open doors, pick up items, defuse, etc. Default: F or E." },
  ability1: { title: "Ability 1", content: "Trigger your first ability/equipment slot." },
  ability2: { title: "Ability 2", content: "Trigger your second ability/equipment slot." },
  ultimateAbility: { title: "Ultimate / Special", content: "Activate your ultimate or class special, if available." },

  // ---- Inventory / Quick slots ----
  openInventory: { title: "Open Inventory", content: "Open inventory or loadout screen." },
  quickSlot1: { title: "Quick Slot 1", content: "Direct use/select of slot 1. Default: 1." },
  quickSlot2: { title: "Quick Slot 2", content: "Direct use/select of slot 2. Default: 2." },
  quickSlot3: { title: "Quick Slot 3", content: "Direct use/select of slot 3. Default: 3." },
  quickSlot4: { title: "Quick Slot 4", content: "Direct use/select of slot 4. Default: 4." },
  dropItem: { title: "Drop Item", content: "Drop the currently held item or selected inventory stack." },

  // ---- Communication / UI ----
  pushToTalk: { title: "Push-to-Talk", content: "Hold to transmit voice chat." },
  ping: { title: "Ping / Mark", content: "Place a contextual marker for the team." },
  chat: { title: "Text Chat", content: "Open team/global chat." },
  scoreboard: { title: "Scoreboard", content: "Show match stats. Often held." },
  map: { title: "Map", content: "Open tactical map or minimap expand." },
  pauseMenu: { title: "Pause / Menu", content: "Open the pause/options menu. Esc by default." },
};

export const keybindPresetContent = [
  { heading: "PC Default", content: "classic WASD, R reload, F interact." },
  { heading: "Tactical", content: "crouch on C, melee on V, grenade on G." },
  { heading: "Left-Handed", content: "mirrored around the keyboard." },
  { heading: "Custom", content: "tweak anything; changing a bind switches the preset label to Custom." },
];