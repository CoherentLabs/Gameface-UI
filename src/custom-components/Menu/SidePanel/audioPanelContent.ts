export const audioPanelContent: Record<string, { title: string; content: string }> = {
  masterVolume: {
    title: "Master Volume",
    content:
      "Controls the overall game audio level. This affects all categories (music, SFX, voice) unless individually muted.",
  },
  musicVolume: {
    title: "Music Volume",
    content:
      "Adjusts soundtrack volume. Turn it down if you want clearer callouts or louder SFX during gameplay.",
  },
  sfxVolume: {
    title: "SFX Volume",
    content:
      "Sets the loudness of gameplay sounds like gunfire, footsteps, and UI pings.",
  },
  voiceChatVolume: {
    title: "Voice Chat Volume",
    content:
      "Controls incoming voice chat loudness from your teammates. Does not affect your microphone level.",
  },
  muteAll: {
    title: "Mute All",
    content:
      "Silences all in-game audio immediately. Useful for quick breaks; individual sliders are ignored while enabled.",
  },
  voiceChatDelay: {
    title: "Voice Chat Delay (ms)",
    content:
      "Adds a small playback delay to incoming voice to help reduce echo or sync with stream capture. Higher values may feel laggy.",
  },
  outputDevice: {
    title: "Output Device",
    content:
      "Choose which audio device the game uses (e.g., speakers, headset, virtual cable). Switch here if the sound is going to the wrong output.",
  },
  subtitles: {
    title: "Subtitles",
    content:
      "Show on-screen text for dialogue and key voice lines. Recommended for clarity in noisy environments.",
  },
  audioLanguage: {
    title: "Audio Language",
    content:
      "Select the spoken dialogue language where available. May require a content download or game restart in some titles.",
  },
};
