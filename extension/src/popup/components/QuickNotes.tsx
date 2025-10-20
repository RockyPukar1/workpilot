import { useState } from "react";
import { ArrowLeft, Plus, Save, Trash2, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useNotes } from "@/shared/hooks/useNotes";
import { format } from "date-fns";
import type { Note } from "@/shared/types";

export function QuickNotes() {
  const navigate = useNavigate();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title || "");
    setContent(note.content);
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setIsCreating(true);
  };

  const handleSave = () => {
    const now = Date.now();

    if (selectedNote) {
      // Update existing note
      updateNote({
        id: selectedNote.id!,
        changes: {
          title: title || undefined,
          content,
          updatedAt: now,
        },
      });
    } else {
      // Create new note
      addNote({
        title: title || undefined,
        content,
        tags: [],
        createdAt: now,
        updatedAt: now,
      });
      setIsCreating(false);
    }

    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleDelete = (id: number) => {
    deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitle("");
      setContent("");
    }
  };

  const isEditing = selectedNote || isCreating;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Quick Notes</h2>
              <p className="text-xs text-muted-foreground">
                {notes.length} notes
              </p>
            </div>
          </div>
          <Button size="sm" onClick={handleNewNote}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Notes List */}
        <div className="w-48 border-r">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {notes.length === 0 ? (
                <div className="text-center py-8 px-2">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">No notes yet</p>
                </div>
              ) : (
                notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`p-2 cursor-pointer hover:bg-accent transition-colors ${
                      selectedNote?.id === note.id
                        ? "bg-accent border-primary/50"
                        : ""
                    }`}
                    onClick={() => handleSelectNote(note)}
                  >
                    <p className="text-sm font-medium line-clamp-1">
                      {note.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(note.updatedAt, "MMM d")}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {isEditing ? (
            <>
              <div className="p-4 space-y-3 flex-1 overflow-auto">
                <Input
                  placeholder="Note title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Start typing your note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
              </div>
              <Separator />
              <div className="p-4 flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Note
                </Button>
                {selectedNote && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(selectedNote.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Select a note or create a new one
                </p>
                <Button onClick={handleNewNote}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
