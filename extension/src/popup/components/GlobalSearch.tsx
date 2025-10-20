import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clipboard,
  StickyNote,
  Mail,
  Camera,
  FileText,
  Link,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { useNotes } from "@/shared/hooks/useNotes";
import { useTemplates } from "@/shared/hooks/useTemplates";
import { useScreenshots } from "@/shared/hooks/useScreenshots";
import { format } from "date-fns";

interface GlobalSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GlobalSearch({
  open: controlledOpen,
  onOpenChange,
}: GlobalSearchProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const { items: clipboardItems } = useClipboard();
  const { notes } = useNotes();
  const { templates } = useTemplates();
  const { screenshots } = useScreenshots();

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const handleSelect = (type: string, id?: number) => {
    setOpen(false);

    // Navigate to the route with or without ID
    if (id) {
      navigate(`/${type}/${id}`);
    } else {
      navigate(`/${type}`);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search everything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Clipboard Items */}
        {clipboardItems.length > 0 && (
          <>
            <CommandGroup heading="Clipboard">
              {clipboardItems.slice(0, 5).map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.content}
                  onSelect={() => handleSelect("clipboard", item.id)}
                >
                  {item.type === "url" ? (
                    <Link className="mr-2 h-4 w-4" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  <span className="truncate">{item.content}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {format(item.timestamp, "MMM d")}
                  </span>
                </CommandItem>
              ))}
              {clipboardItems.length > 5 && (
                <CommandItem
                  onSelect={() => handleSelect("clipboard")}
                  onClick={() => handleSelect("clipboard")}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span>View all {clipboardItems.length} items...</span>
                </CommandItem>
              )}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <>
            <CommandGroup heading="Notes">
              {notes.slice(0, 5).map((note) => (
                <CommandItem
                  key={note.id}
                  value={note.title || note.content}
                  onSelect={() => handleSelect("notes", note.id)}
                >
                  <StickyNote className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {note.title || note.content.substring(0, 50)}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {format(note.updatedAt, "MMM d")}
                  </span>
                </CommandItem>
              ))}
              {notes.length > 5 && (
                <CommandItem
                  onSelect={() => handleSelect("notes")}
                  onClick={() => handleSelect("notes")}
                >
                  <StickyNote className="mr-2 h-4 w-4" />
                  <span>View all {notes.length} notes...</span>
                </CommandItem>
              )}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Templates */}
        {templates.length > 0 && (
          <>
            <CommandGroup heading="Email Templates">
              {templates.slice(0, 5).map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.name + " " + template.body}
                  onSelect={() => handleSelect("templates", template.id)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{template.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">
                    {template.shortcut}
                  </span>
                </CommandItem>
              ))}
              {templates.length > 5 && (
                <CommandItem
                  onSelect={() => handleSelect("templates")}
                  onClick={() => handleSelect("templates")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>View all {templates.length} templates...</span>
                </CommandItem>
              )}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <CommandGroup heading="Screenshots">
            {screenshots.slice(0, 3).map((screenshot) => (
              <CommandItem
                key={screenshot.id}
                value={screenshot.sourceUrl || "screenshot"}
                onSelect={() => handleSelect("screenshots", screenshot.id)}
                onClick={() => handleSelect("screenshots", screenshot.id)}
              >
                <Camera className="mr-2 h-4 w-4" />
                <span className="truncate">
                  {screenshot.sourceUrl
                    ? new URL(screenshot.sourceUrl).hostname
                    : "Screenshot"}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {format(screenshot.timestamp, "MMM d")}
                </span>
              </CommandItem>
            ))}
            {screenshots.length > 3 && (
              <CommandItem
                onSelect={() => handleSelect("screenshots")}
                onClick={() => handleSelect("screenshots")}
              >
                <Camera className="mr-2 h-4 w-4" />
                <span>View all {screenshots.length} screenshots...</span>
              </CommandItem>
            )}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
