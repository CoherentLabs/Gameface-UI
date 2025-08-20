export const gameplayPanelContent: Record<string, { title: string; content: string; }> = {
  difficulty: {
    title: "Difficulty",
    content:
      "Determines how challenging enemies and encounters are. Higher difficulties may reward you with additional score and bragging rights.",
  },
  subtitles: {
    title: "Subtitles",
    content:
      "Toggles subtitles for all spoken dialogue. Recommended for players who want to follow the story in noisy environments.",
  },
  subtitleSize: {
    title: "Subtitle Size",
    content:
      "Adjusts the size of on-screen subtitle text — useful when playing on smaller screens or from a longer viewing distance. Play around with the slider for a live preview",
  },
  subtitleColor: {
    title: "Subtitle Color",
    content:
      "Customize the color of the subtitle text for readability or accessibility. Use the color picker to select your desired color: ",
  },
  fov: {
    title: "Field of View",
    content:
      "Wider FOV values show more of the world at once, but may reduce visual clarity or cause distortion on certain screens.",
  },
  mouseSensitivity: {
    title: "Mouse Sensitivity",
    content:
      "Controls how quickly the in-game camera rotates when moving your mouse. Higher values translate to faster movement.",
  },
  tutorialHints: {
    title: "Tutorial Hints",
    content:
      "Displays contextual hints during gameplay to help you learn new mechanics and interactions.",
  },
  autoSave: {
    title: "Auto-Save",
    content:
      "Automatically saves your progress at checkpoints. Disable for a more hardcore experience.",
  },
  aimAssist: {
    title: "Aim Assist",
    content:
      "Helps slightly adjust your aim towards targets when using a controller. Affects only certain control schemes.",
  },
  vibration: {
    title: "Controller Vibration",
    content:
      "Toggles rumble feedback for compatible gamepads. Provides immersion but may use additional battery.",
  },
};