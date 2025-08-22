export const graphicsPanelContent: Record<string, { title: string; content: string }> = {
  // -------- Preset & global ----------
  graphicsPreset: {
    title: "Graphics Preset",
    content:
      "One toggle to rule them all. Presets bundle common quality settings:"
  },

  resolution: {
    title: "Resolution",
    content:
      "Determines the number of pixels used to render the game. Higher values produce clearer visuals but may reduce performance.",
  },
  display: {
    title: "Display Mode",
    content:
      "Controls how the game window behaves. Fullscreen often performs best; Borderless is ideal for quick alt-tabbing.",
  },
  brightness: {
    title: "Brightness",
    content:
      "Adjusts overall scene luminance. Raise to reveal dark areas; too high can wash out midtones.",
  },
  contrast: {
    title: "Contrast",
    content:
      "Controls separation between darks and brights. Higher contrast looks punchier but can crush shadow detail.",
  },
  "v-sync": {
    title: "Vertical Sync (V-Sync)",
    content:
      "Syncs the frame rate to your monitor to prevent screen tearing. Can add a bit of input latency.",
  },
  hudOpacity: {
    title: "HUD Opacity",
    content:
      "Sets the transparency of on-screen HUD elements. Lower values reduce visual clutter.",
  },
  crosshairColor: {
    title: "Crosshair Color",
    content:
      "Customize your reticle color for visibility across different backgrounds.",
  },

  // -------- Custom submenu (shown when preset = Custom) ----------
  textureQuality: {
    title: "Texture Quality",
    content:
      "Controls texture resolution. Higher values look sharper up close and use more VRAM.",
  },
  shadowQuality: {
    title: "Shadow Quality",
    content:
      "Sets shadow resolution and filtering. Higher values reduce aliasing and shimmering at a performance cost.",
  },
  viewDistance: {
    title: "View Distance",
    content:
      "How far high-detail objects are drawn. Longer distances improve distant clarity but increase CPU/GPU load.",
  },
  lodQuality: {
    title: "Level of Detail (LOD)",
    content:
      "How aggressively models swap to simpler versions at distance. Higher quality keeps detail further away.",
  },
  antiAliasing: {
    title: "Anti-Aliasing",
    content:
      "Smooths jagged edges. FXAA is fastest/softest; TAA is stable but a bit blurry; SMAA is crisper; Off is sharp but aliased.",
  },
  upscaling: {
    title: "Upscaling (DLSS/FSR/XeSS)",
    content:
      "Renders at a lower internal resolution and reconstructs to your display resolution. Modes (Performance/Balanced/Quality) trade sharpness for FPS.",
  },
  upscalerSharpness: {
    title: "Upscaler Sharpness",
    content:
      "Fine-tunes edge/detail sharpening when using an upscaler. Higher sharpness can introduce halos.",
  },
  renderScale: {
    title: "Render Scale",
    content:
      "Percentage of native resolution the scene is rendered at (100% = native). Lower values boost FPS but soften the image.",
  },
  anisotropicFiltering: {
    title: "Anisotropic Filtering",
    content:
      "Improves texture clarity at glancing angles (roads/floors). 16× looks best; minimal performance impact on modern GPUs.",
  },
  ambientOcclusion: {
    title: "Ambient Occlusion",
    content:
      "Adds contact shadows where objects meet to enhance depth. SSAO/HBAO+ look better but cost performance.",
  },
  screenSpaceReflections: {
    title: "Screen-Space Reflections (SSR)",
    content:
      "Adds reflective detail on surfaces using on-screen data. Improves realism; can shimmer and costs GPU time.",
  },
  globalIllumination: {
    title: "Global Illumination",
    content:
      "Simulates indirect light bouncing for more natural lighting. Higher quality greatly improves realism with heavy cost.",
  },
  volumetricFog: {
    title: "Volumetrics / Fog",
    content:
      "Quality of volumetric lighting and fog scattering. Higher values add depth rays and thicker atmosphere.",
  },
  postProcessingQuality: {
    title: "Post-Processing Quality",
    content:
      "Quality of overall post effects (tone map, color grading, bloom, etc.). Higher looks cleaner but costs a bit of GPU.",
  },
  bloom: {
    title: "Bloom",
    content:
      "Glow around bright lights. Cosmetic; turn down if you prefer a cleaner, less glary look.",
  },
  motionBlur: {
    title: "Motion Blur",
    content:
      "Adds blur during fast camera/object movement. Style choice; disable for maximum clarity.",
  },
  depthOfField: {
    title: "Depth of Field",
    content:
      "Blurs objects out of focus in cutscenes or ads realism in gameplay. Higher quality is heavier.",
  },
  filmGrain: {
    title: "Film Grain",
    content:
      "Adds film-like grain. Purely stylistic; set to 0 for the cleanest image.",
  },
  chromaticAberration: {
    title: "Chromatic Aberration",
    content:
      "Simulates lens color fringing toward screen edges. Style effect; disable for maximum clarity.",
  },
  tessellation: {
    title: "Tessellation",
    content:
      "Adds geometric detail to surfaces (e.g., bricks/rocks) for better depth. GPU-heavy at higher levels.",
  },
  waterQuality: {
    title: "Water Quality",
    content:
      "Controls water surface detail, reflections, and refractions. Higher looks better, especially at distance.",
  },
  foliageDensity: {
    title: "Foliage Density",
    content:
      "Amount of grass, leaves, and clutter. Higher density improves realism but impacts CPU/GPU.",
  },
  reflectionsQuality: {
    title: "Reflections Quality",
    content:
      "Quality of dynamic reflections beyond SSR (planar/cubemap). Higher settings make mirrors/water more accurate.",
  },
  hdr: {
    title: "HDR (High Dynamic Range)",
    content:
      "Enables a wider brightness/color range on HDR-capable displays. Requires OS and monitor HDR to be enabled.",
  },
};

export const graphicPresetContent = [
    "Low - maximizes FPS: low textures/shadows, short view distance, AO/SSR off, minimal post-processing.",
    "Medium - balanced defaults: medium textures/shadows, moderate view distance, light AO, basic post-FX.",
    "High - sharp visuals: high textures/shadows, long view distance, AO/SSR on, full post-FX.",
    "Ultra - max fidelity: everything cranked; highest VRAM/CPU/GPU cost.",
    "Custom - pick your own mix. Changing any individual option switches the preset label to Custom. Switching back to a preset overwrites Custom tweaks.",
]