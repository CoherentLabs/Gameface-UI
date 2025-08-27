export type CreditEntry = { name: string; role: string };
export type CreditSection = { section: string; entries: CreditEntry[] };

export const CREDITS: CreditSection[] = [
  {
    section: "Studio Leadership",
    entries: [
      { name: "Alex Carter", role: "Game Director" },
      { name: "Mina Park", role: "Executive Producer" },
      { name: "Jules Navarro", role: "Creative Director" },
      { name: "Priya Nair", role: "Technical Director" },
    ],
  },
  {
    section: "Production",
    entries: [
      { name: "Daniel Romero", role: "Lead Producer" },
      { name: "Sofia Marin", role: "Associate Producer" },
      { name: "Owen Blake", role: "Project Manager" },
      { name: "Hana Ito", role: "Release Manager" },
    ],
  },
  {
    section: "Game Design",
    entries: [
      { name: "Lena Ortiz", role: "Lead Designer" },
      { name: "Marco Voss", role: "Systems Designer" },
      { name: "Kayla Zheng", role: "Level Designer" },
      { name: "Theo Nilsson", role: "Combat Designer" },
    ],
  },
  {
    section: "Engineering",
    entries: [
      { name: "Ibrahim Khan", role: "Lead Engineer" },
      { name: "Noah Fischer", role: "Gameplay Engineer" },
      { name: "Eva Rossi", role: "Graphics/Rendering Engineer" },
      { name: "Harper Quinn", role: "UI Engineer" },
      { name: "Riley Chen", role: "Build/Tools Engineer" },
    ],
  },
  {
    section: "Art",
    entries: [
      { name: "Mara Dimitri", role: "Art Director" },
      { name: "Jonah Patel", role: "Character Artist" },
      { name: "Sera Almeida", role: "Environment Artist" },
      { name: "Tomas Novak", role: "VFX Artist" },
      { name: "Nina Volkov", role: "UI/UX Artist" },
    ],
  },
  {
    section: "Audio",
    entries: [
      { name: "Elijah Brooks", role: "Audio Director" },
      { name: "Yuki Arai", role: "Composer" },
      { name: "Maddie Solis", role: "Sound Designer" },
      { name: "Cole Bianchi", role: "Voice Producer" },
    ],
  },
  {
    section: "Quality Assurance",
    entries: [
      { name: "Grace Kim", role: "QA Lead" },
      { name: "Victor Santos", role: "Senior QA Tester" },
      { name: "Iris Nguyen", role: "QA Tester" },
      { name: "Leo Anders", role: "QA Automation" },
    ],
  },
  {
    section: "Community & Marketing",
    entries: [
      { name: "Rowan Ellis", role: "Community Manager" },
      { name: "Amelia Duarte", role: "Social Media" },
      { name: "Miles Harper", role: "PR/Comms" },
      { name: "Bea Kowalski", role: "Brand Designer" },
    ],
  },
  {
    section: "Localization",
    entries: [
      { name: "Global Loc Team", role: "Localization Production" },
      { name: "Lingua Partner", role: "Translation Services" },
      { name: "QC Vendors", role: "LQA" },
    ],
  },
  {
    section: "Tools & Middleware",
    entries: [
      { name: "FMOD Studio", role: "Audio Middleware" },
      { name: "Perforce / Git LFS", role: "Version Control" },
      { name: "Wwise / OpenAL", role: "Audio Tech" },
      { name: "Internal Tooling", role: "Build & CI" },
    ],
  },
  {
    section: "Special Thanks",
    entries: [
      { name: "Our Playtesters", role: "Feedback Legends" },
      { name: "Friends & Family", role: "Support Crew" },
      { name: "You", role: "For Playing" },
    ],
  },
  {
    section: "© Credits",
    entries: [
      { name: "© 2025 All Rights Reserved ", role: "Studio Name" },
    ],
  },
];
