# 🚀 Getting Started with WorkPilot

## What You Have Now

A fully functional Chrome extension with 4 productivity features:

1. ✅ **Clipboard Manager** - Smart clipboard history
2. ✅ **Quick Notes** - Fast note-taking
3. ✅ **Email Templates** - Reusable templates with variables
4. ✅ **Screen Capture** - Screenshot tool with history

## Next Steps

### Step 1: Install Dependencies (Required)

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Navigate to project root
cd /home/rockypukar/projects/chrome-extensions/workpilot

# Install extension dependencies

pnpm install:all
```

### Step 2: Build the Extension

```bash
cd extension
pnpm build
```

This creates a `dist/` folder with the compiled extension.

### Step 3: Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `extension/dist` folder
5. Extension should appear! Click the icon to test.

### Step 4: Test All Features

- **Dashboard:** Click extension icon → See all 4 features
- **Clipboard:** Copy some text → Alt+C to open → Check history
- **Notes:** Alt+N → Create a note → Save
- **Templates:** Create template → Test in Gmail
- **Screenshots:** Alt+S → Capture current tab

### Step 5: Fix Any Issues

If you see errors:

```bash
# Check browser console (right-click popup → Inspect)
# Check background worker (chrome://extensions/ → Inspect views)

# Common fixes:
cd extension
rm -rf node_modules
pnpm install
pnpm build
```

## Development Workflow

### For UI Changes

```bash
cd extension
pnpm dev
```

This starts Vite dev server. Changes auto-reload!

### For Background/Content Script Changes

```bash
cd extension
pnpm watch
```

This rebuilds on file changes. Then go to `chrome://extensions/` and click refresh icon.

## File Structure Overview

```
extension/
├── src/
│   ├── popup/              # Main UI
│   │   ├── App.tsx         # Root component
│   │   ├── Popup.tsx       # Router
│   │   └── components/     # 4 feature components
│   │       ├── Dashboard.tsx
│   │       ├── ClipboardManager.tsx
│   │       ├── QuickNotes.tsx
│   │       ├── EmailTemplates.tsx
│   │       └── ScreenCapture.tsx
│   ├── background/         # Service worker
│   │   └── index.ts
│   ├── content/            # Gmail/Outlook scripts
│   │   └── index.ts
│   └── shared/             # Shared code
│       ├── components/ui/  # shadcn/ui components
│       ├── hooks/          # React Query hooks
│       ├── store/          # Zustand state
│       ├── db/             # Dexie database
│       └── types/          # TypeScript + Zod schemas
└── public/
    └── manifest.json       # Extension config
```

## Tech Stack

- **React 18** + **TypeScript** - UI
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **React Query** - Data fetching
- **Dexie.js** - IndexedDB (local storage)
- **Zod** - Validation

## Common Tasks

### Add a New Feature

1. Create component in `src/popup/components/MyFeature.tsx`
2. Add route in `src/popup/Popup.tsx`
3. Add to dashboard in `src/popup/components/Dashboard.tsx`
4. Create types in `src/shared/types/index.ts`
5. Add database table in `src/shared/db/index.ts`

### Add a New shadcn Component

```bash
# Install shadcn CLI
npx shadcn-ui@latest add [component-name]
```

Example:

```bash
npx shadcn-ui@latest add dialog
```

### Change Styling

All global styles are in `src/styles/globals.css`.
Use TailwindCSS classes in components.

## Keyboard Shortcuts

- `Alt+C` - Open Clipboard Manager
- `Alt+N` - Open Quick Notes
- `Alt+S` - Take Screenshot

To change shortcuts, edit `public/manifest.json` under `commands`.

## Debugging

### View Popup Logs

Right-click extension icon → Inspect popup → Console tab

### View Background Logs

`chrome://extensions/` → Click "Inspect views: service worker"

### View Content Script Logs

Open any Gmail tab → F12 → Console → Look for "WorkPilot" logs

## Need Help?

### Common Issues

**Build fails:**

```bash
rm -rf node_modules
pnpm install
pnpm build
```

**Extension not loading:**

- Make sure you selected the `dist/` folder, not `extension/` folder
- Check for errors in `chrome://extensions/`
- Try removing and re-adding the extension

**Icons not showing:**

- Make sure you created all 3 icon files
- Check `public/manifest.json` paths are correct
- Rebuild: `pnpm build`

**Features not working:**

- Check browser console for errors
- Make sure extension has required permissions
- Try refreshing the extension

### Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Vite Docs](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
