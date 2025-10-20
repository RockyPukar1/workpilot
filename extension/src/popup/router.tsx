import { createMemoryRouter } from "react-router-dom";

import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ClipboardManager } from "./components/ClipboardManager";
import { QuickNotes } from "./components/QuickNotes";
import { NoteDetail } from "./components/NoteDetail";
import { EmailTemplates } from "./components/EmailTemplates";
import { TemplateDetail } from "./components/TemplateDetail";
import { ScreenCapture } from "./components/ScreenCapture";
import { ScreenshotDetail } from "./components/ScreenshotDetail";
import { Settings } from "./components/Settings";

export const router = createMemoryRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "clipboard",
        element: <ClipboardManager />,
      },
      {
        path: "notes",
        children: [
          {
            index: true,
            element: <QuickNotes />,
          },
          {
            path: ":id",
            element: <NoteDetail />,
          },
        ],
      },
      {
        path: "templates",
        children: [
          {
            index: true,
            element: <EmailTemplates />,
          },
          {
            path: ":id",
            element: <TemplateDetail />,
          },
        ],
      },
      {
        path: "screenshots",
        children: [
          {
            index: true,
            element: <ScreenCapture />,
          },
          {
            path: ":id",
            element: <ScreenshotDetail />,
          },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
