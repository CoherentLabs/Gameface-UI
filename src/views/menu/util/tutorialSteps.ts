export const TutorialSteps = {
  Intro: {
    order: 1,
    title: "Welcome to the Menu UI Sample",
    content:
      "This screen showcases how Gameface UI can be used to build a complete in-game settings menu.",
  },
  Tabs: {
    order: 2,
    title: "Menu Tab Navigation",
    content:
      "We're using the Tabs and TabLinks components to handle section switching. Each tab dynamically renders its own content without reloading the layout.",
  },
  Structure: {
    order: 3,
    title: "Layout Structure",
    content:
      "The main layout is split into two parts: the left 8 columns hold the main content, while the right 4 columns host contextual information and interactive elements.",
  },
  Scroll: {
    order: 4,
    title: "Scrollable Container",
    content:
      "This section uses the Scroll component, which auto-adjusts its height based on the tab's content and conditionally provides a scroll handle when needed.",
  },
  Collapsable: {
    order: 5,
    title: "Collapsible Options",
    content:
      "Some components can be expanded or collapsed. Try it out by toggling the \"Subtitles\" option.",
  },
  Interactive: {
    order: 6,
    title: "Click the Toggle Button",
    content:
      "Enable the Subtitles option to reveal nested settings.",
  },
  Dynamic: {
    order: 7,
    title: "Dynamic Options",
    content:
      "Notice the nested options that appeared! These settings are revealed based on parent option states.",
  },
  InfoPanel: {
    order: 8,
    title: "Component Info Panel",
    content:
      "The right panel updates based on your selection, providing additional information and context for each menu option.",
  },
  InteractiveTwo: {
    order: 9,
    title: "Interactive Panels",
    content:
      "Some panels have interactions that reflect changes in the menu. Try adjusting the color picker's value.",
  },
  ColorChange: {
    order: 10,
    title: "Component Reacts to Interaction",
    content:
      "Watch how the menu item's background color updates to match the ColorPicker component's value in real-time.",
  },
  Footer: {
    order: 11,
    title: "Static Footer Controls",
    content:
      "The footer displays a static list of keyboard shortcuts for quick navigation throughout the menu.",
  },
  End: {
    order: 12,
    title: "End of Tour",
    content:
      "That's the overview of our Menu UI sample. Feel free to explore and extend this sample to fit your project needs.",
  }
} as const;