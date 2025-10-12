import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Pin,
  Copy,
  Trash2,
  Link,
  FileText,
  Image as ImageIcon,
  PinOff,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Card } from "@/shared/components/ui/card";
import { useAppStore } from "@/shared/store";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { cn } from "@/shared/utils/cn";
import { format } from "date-fns";

export function ClipboardManager() {
  const setCurrentView = useAppStore((state) => state.setCurrentView);
  const { items, updateItem, deleteItem, clearAll } = useClipboard();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const togglePin = (id: number, currentPinned: boolean) => {
    updateItem({ id, changes: { pinned: !currentPinned } });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "url":
        return Link;
      case "image":
        return ImageIcon;
      default:
        return FileText;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Clipboard Manager</h2>
            <p className="text-xs text-muted-foreground">
              {items.length} items
            </p>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="border-b px-4 py-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clipboard history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Pin className="h-3 w-3 mr-1" />
            Pinned Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => clearAll()}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Clipboard Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No items found" : "No clipboard history yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Copy something to get started
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = getIcon(item.type);
              return (
                <Card
                  key={item.id}
                  className={cn(
                    "p-3 hover:shadow-sm transition-all",
                    item.pinned && "border-primary/50 bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2 break-all">
                        {item.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(item.timestamp, "MMM d, h:mm a")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => togglePin(item.id!, item.pinned)}
                      >
                        {item.pinned ? (
                          <PinOff className="h-3 w-3" />
                        ) : (
                          <Pin className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyToClipboard(item.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => deleteItem(item.id!)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
