import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useTemplates } from "@/shared/hooks/useTemplates";
import { TEMPLATE_CATEGORIES } from "@/shared/constants/categories";

export function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, updateTemplate, deleteTemplate } = useTemplates();

  const [name, setName] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>("general");

  const template = templates.find((t) => t.id === parseInt(id || "0"));

  useEffect(() => {
    if (template) {
      setName(template.name);
      setShortcut(template.shortcut);
      setSubject(template.subject || "");
      setBody(template.body);
      setCategory(template.category || "general");
    } else if (id) {
      // Template not found, redirect back
      navigate("/templates");
    }
  }, [template, id, navigate]);

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{(\w+)\}/g);
    return matches ? matches.map((m) => m.slice(1, -1)) : [];
  };

  const handleSave = () => {
    if (!template?.id || !name || !shortcut || !body) return;

    const allVariables = [
      ...extractVariables(subject),
      ...extractVariables(body),
    ];
    const variables = [...new Set(allVariables)];

    updateTemplate({
      id: template.id,
      changes: {
        name,
        shortcut,
        subject,
        body,
        category,
        variables,
      },
    });

    navigate("/templates");
  };

  const handleDelete = () => {
    if (!template?.id || !confirm("Delete this template?")) return;

    deleteTemplate(template.id);
    navigate("/templates");
  };

  if (!template) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Template not found</p>
        <Button className="mt-4" onClick={() => navigate("/templates")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
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
            onClick={() => navigate("/templates")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Edit Template</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <Button onClick={handleSave} disabled={!name || !shortcut || !body}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Template Name *
          </label>
          <Input
            placeholder="e.g., Follow-up Email"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Shortcut *</label>
            <Input
              placeholder="e.g., followup"
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value.toLowerCase())}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Type /{shortcut} in email
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Subject (optional)
          </label>
          <Input
            placeholder="e.g., Re: {topic}"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Body *</label>
          <Textarea
            placeholder="Hi {name},&#10;&#10;I wanted to follow up on..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[250px] resize-none font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use {"{"}variable{"}"} for dynamic content
          </p>
        </div>

        {/* Variables Preview */}
        {(extractVariables(subject).length > 0 ||
          extractVariables(body).length > 0) && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-xs font-medium mb-2">Detected Variables:</p>
            <div className="flex flex-wrap gap-1">
              {[
                ...new Set([
                  ...extractVariables(subject),
                  ...extractVariables(body),
                ]),
              ].map((variable) => (
                <span
                  key={variable}
                  className="text-xs bg-background px-2 py-0.5 rounded"
                >
                  {"{"}
                  {variable}
                  {"}"}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
