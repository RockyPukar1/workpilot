import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Search, Command } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
          >
            <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="flex-1 text-left">Search everything...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
        <Outlet />
      </div>
    </div>
  );
}
