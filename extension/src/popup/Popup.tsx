import { useAppStore } from "@/shared/store";
import { Dashboard } from "./components/Dashboard";
import { ClipboardManager } from "./components/ClipboardManager";
import { QuickNotes } from "./components/QuickNotes";
import { EmailTemplates } from "./components/EmailTemplates";
import { ScreenCapture } from "./components/ScreenCapture";

export function Popup() {
  const currentView = useAppStore((state) => state.currentView);

  return (
    <div className="w-[600px] h-[500px] bg-background">
      {currentView === "dashboard" && <Dashboard />}
      {currentView === "clipboard" && <ClipboardManager />}
      {currentView === "notes" && <QuickNotes />}
      {currentView === "templates" && <EmailTemplates />}
      {currentView === "screenshots" && <ScreenCapture />}
    </div>
  );
}
