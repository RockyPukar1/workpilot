# WorkPilot 🚀

Corporate Productivity Suite - Chrome Extension

## Features

1. **Smart Clipboard Manager** - Never lose what you copied
2. **Quick Notes & Scratchpad** - Fast note-taking anywhere
3. **Email Template Snippets** - Reusable email templates with variables
4. **Screen Capture & Annotate** - Screenshot with instant annotation

## Project Structure

```
workpilot/
├── extension/        # Chrome extension (React + TypeScript)
├── backend/          # Backend API (Node.js + Express + PostgreSQL)
├── shared-types/     # Shared TypeScript types
```

## Tech Stack

### Extension

- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- Zustand (state management)
- React Query (data fetching)
- Dexie.js (IndexedDB)
- Zod (validation)

### Backend

- Node.js + Express
- PostgreSQL + Prisma
- Supabase (auth, storage)
- Stripe (payments)

## 🎯 Features Implemented

### 1. Clipboard Manager

- Automatic clipboard history (100 items)
- Pin important items
- Search functionality
- Type detection (text, URL, image)
- One-click copy
- Delete individual or clear all

### 2. Quick Notes

- Fast note creation
- Title + content fields
- Auto-save
- Edit existing notes
- Delete notes
- Timestamp tracking

### 3. Email Templates

- Create reusable templates
- Variable support (`{name}`, `{company}`)
- Shortcut-based insertion
- Subject + body fields
- Copy to clipboard
- Edit and delete templates

### 4. Screen Capture

- One-click screenshot capture
- Screenshot history
- Download screenshots
- Source URL tracking
- Thumbnail previews
- Bulk delete

### 5. Dashboard

- Central hub for all features
- Feature statistics
- Quick navigation
- Keyboard shortcuts display

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ **React 18** - UI framework
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool & dev server
- 🎨 **TailwindCSS** - Styling
- 🧩 **shadcn/ui** - UI components
- 🗄️ **Zustand** - State management
- 🔄 **React Query** - Data fetching & caching
- 💾 **Dexie.js** - IndexedDB wrapper
- ✅ **Zod** - Schema validation

### Backend (Ready for Phase 2)

- 🟢 **Node.js + Express**
- 🐘 **PostgreSQL + Prisma**
- ☁️ **Supabase** - Auth & Storage
- 💳 **Stripe** - Payments (planned)

---

## 📁 Complete File Structure

```
workpilot/
├── extension/                          # Chrome Extension (MAIN)
│   ├── public/
│   │   ├── icons/                      # Extension icons (YOU NEED TO CREATE)
│   │   │   ├── icon16.png             # 16x16 toolbar icon
│   │   │   ├── icon48.png             # 48x48 management page
│   │   │   ├── icon128.png            # 128x128 store listing
│   │   │   └── ICONS_README.md
│   │   └── manifest.json              # Extension configuration
│   ├── src/
│   │   ├── popup/                      # Popup UI (600x500px window)
│   │   │   ├── index.html
│   │   │   ├── index.tsx              # Entry point
│   │   │   ├── App.tsx                # Root component
│   │   │   ├── Popup.tsx              # Router component
│   │   │   └── components/
│   │   │       ├── Dashboard.tsx      # ✅ Main dashboard
│   │   │       ├── ClipboardManager.tsx # ✅ Feature 1
│   │   │       ├── QuickNotes.tsx     # ✅ Feature 2
│   │   │       ├── EmailTemplates.tsx # ✅ Feature 3
│   │   │       └── ScreenCapture.tsx  # ✅ Feature 4
│   │   ├── background/
│   │   │   └── index.ts               # ✅ Service worker
│   │   ├── content/
│   │   │   ├── index.ts               # ✅ Content script (Gmail/Outlook)
│   │   │   └── styles.css
│   │   ├── shared/
│   │   │   ├── api/                    # API client (for Phase 2)
│   │   │   ├── services/              # Business logic
│   │   │   ├── db/
│   │   │   │   └── index.ts           # ✅ Dexie database setup
│   │   │   ├── components/
│   │   │   │   ├── query-provider.tsx # ✅ React Query setup
│   │   │   │   └── ui/                # ✅ shadcn components
│   │   │   │       ├── button.tsx
│   │   │   │       ├── card.tsx
│   │   │   │       ├── input.tsx
│   │   │   │       ├── textarea.tsx
│   │   │   │       ├── tabs.tsx
│   │   │   │       ├── scroll-area.tsx
│   │   │   │       └── separator.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useClipboard.ts    # ✅ Clipboard hook
│   │   │   │   ├── useNotes.ts        # ✅ Notes hook
│   │   │   │   ├── useTemplates.ts    # ✅ Templates hook
│   │   │   │   └── useScreenshots.ts  # ✅ Screenshots hook
│   │   │   ├── store/
│   │   │   │   └── index.ts           # ✅ Zustand store
│   │   │   ├── utils/
│   │   │   │   ├── cn.ts              # ✅ TailwindCSS helper
│   │   │   │   └── storage.ts         # ✅ Storage helpers
│   │   │   ├── types/
│   │   │   │   └── index.ts           # ✅ TypeScript + Zod schemas
│   │   │   └── constants/
│   │   │       └── index.ts           # ✅ App constants
│   │   └── styles/
│   │       └── globals.css            # ✅ Global styles
│   ├── package.json                   # ✅ Dependencies
│   ├── vite.config.ts                 # ✅ Vite configuration
│   ├── tsconfig.json                  # ✅ TypeScript config
│   ├── tailwind.config.js             # ✅ Tailwind config
│   ├── postcss.config.js              # ✅ PostCSS config
│   ├── components.json                # ✅ shadcn config
│   └── .env.example                   # ✅ Environment template
│
├── backend/                            # Backend API (Ready for Phase 2)
│   ├── src/
│   │   ├── index.ts                   # ✅ Express server
│   │   ├── routes/                    # API routes (placeholder)
│   │   ├── controllers/               # Controllers (placeholder)
│   │   ├── services/                  # Services (placeholder)
│   │   ├── middleware/                # Middleware (placeholder)
│   │   └── db/
│   │       └── prisma/                # Prisma schema (placeholder)
│   ├── package.json                   # ✅ Backend dependencies
│   └── tsconfig.json                  # ✅ TypeScript config
│
├── shared-types/                       # Shared types (for future)
│   └── src/
│
├── package.json                       # ✅ Root workspace config
├── pnpm-workspace.yaml                # ✅ Workspace config
├── .gitignore                         # ✅ Git ignore rules
├── README.md                          # ✅ Project overview
├── GETTING_STARTED.md                 # ✅ Quick start guide
└── PROJECT_SUMMARY.md                 # ✅ This file
```

## Development

```bash
# Install dependencies
pnpm install

# Run extension in development mode
pnpm dev

# Build extension for production
pnpm build

# Run backend
pnpm dev:backend
```

## License

MIT
