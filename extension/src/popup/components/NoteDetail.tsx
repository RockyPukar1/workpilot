import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useNotes } from "@/shared/hooks/useNotes";

export function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const note = notes.find((n) => n.id === parseInt(id || "0"));

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content);
      setTags(note.tags || []);
    } else if (id) {
      // Note not found, redirect back
      navigate("/notes");
    }
  }, [note, id, navigate]);

  const handleSave = () => {
    if (!note?.id) return;

    updateNote({
      id: note.id,
      changes: {
        title,
        content,
        tags,
        updatedAt: Date.now(),
      },
    });

    navigate("/notes");
  };

  const handleDelete = () => {
    if (!note?.id || !confirm("Delete this note?")) return;

    deleteNote(note.id);
    navigate("/notes");
  };

  if (!note) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Note not found</p>
        <Button className="mt-4" onClick={() => navigate("/notes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/notes")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Edit Note</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            placeholder="Note title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Content</label>
          <Textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Tags (comma-separated)
          </label>
          <Input
            placeholder="work, personal, ideas"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
