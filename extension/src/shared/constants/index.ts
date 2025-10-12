export const STORAGE_KEYS = {
  CLIPBOARD_HISTORY: "clipboard_history",
  NOTES: "notes",
  TEMPLATES: "templates",
  SCREENSHOTS: "screenshots",
  SETTINGS: "settings",
} as const;

export const LIMITS = {
  CLIPBOARD_MAX_ITEMS: 100,
  SCREENSHOT_MAX_SIZE_MB: 5,
  NOTE_MAX_LENGTH: 50000,
} as const;

export const KEYBOARD_SHORTCUTS = {
  OPEN_CLIPBOARD: "Alt+C",
  OPEN_NOTES: "Alt+N",
  TAKE_SCREENSHOT: "Alt+S",
} as const;

export const FEATURES = [
  {
    id: "clipboard",
    name: "Clipboard Manager",
    icon: "Clipboard",
    description: "Smart clipboard history",
    shortcut: "Alt+C",
  },
  {
    id: "notes",
    name: "Quick Notes",
    icon: "StickyNote",
    description: "Fast note-taking",
    shortcut: "Alt+N",
  },
  {
    id: "templates",
    name: "Email Templates",
    icon: "Mail",
    description: "Reusable templates",
    shortcut: "",
  },
  {
    id: "screenshots",
    name: "Screenshots",
    icon: "Camera",
    description: "Capture & annotate",
    shortcut: "Alt+S",
  },
] as const;
