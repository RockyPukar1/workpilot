import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Mail,
  Copy,
  Edit,
  Filter,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { useTemplates } from "@/shared/hooks/useTemplates";
import { TEMPLATE_CATEGORIES } from "@/shared/constants/categories";
import type { EmailTemplate } from "@/shared/types";

export function EmailTemplates() {
  const navigate = useNavigate();
  const { templates, addTemplate, updateTemplate, deleteTemplate } =
    useTemplates();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );

  const [name, setName] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setName("");
    setShortcut("");
    setSubject("");
    setBody("");
    setCategory("general");
    setIsEditing(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setShortcut(template.shortcut);
    setSubject(template.subject || "");
    setBody(template.body);
    setCategory(template.category || "general");
    setIsEditing(true);
  };

  const handleSave = () => {
    const now = Date.now();
    const variables = extractVariables(body);

    if (editingTemplate) {
      // Update existing template
      updateTemplate({
        id: editingTemplate.id!,
        changes: {
          name,
          shortcut,
          subject: subject || undefined,
          body,
          variables,
          category,
        },
      });
    } else {
      // Create new template
      addTemplate({
        name,
        shortcut,
        subject: subject || undefined,
        body,
        variables,
        category,
        createdAt: now,
      });
    }

    setIsEditing(false);
    setEditingTemplate(null);
    setName("");
    setShortcut("");
    setSubject("");
    setBody("");
    setCategory("general");
  };

  const handleDelete = (id: number) => {
    deleteTemplate(id);
    if (editingTemplate?.id === id) {
      setIsEditing(false);
      setEditingTemplate(null);
    }
  };

  const extractVariables = (text: string): string[] => {
    const regex = /\{(\w+)\}/g;
    const matches = text.match(regex);
    return matches ? matches.map((m) => m.slice(1, -1)) : [];
  };

  const filteredTemplates = templates.filter((template) => {
    if (filterCategory === "all") return true;
    return template.category === filterCategory;
  });

  const copyTemplateToClipboard = async (template: EmailTemplate) => {
    const fullText = template.subject
      ? `Subject: ${template.subject}\n\n${template.body}`
      : template.body;
    await navigator.clipboard.writeText(fullText);
  };

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
              <h2 className="text-lg font-semibold">Email Templates</h2>
              <p className="text-xs text-muted-foreground">
                {templates.length} templates
              </p>
            </div>
          </div>
          <Button size="sm" onClick={handleNewTemplate}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {isEditing ? (
        /* Template Editor */
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  placeholder="e.g., Follow-up Email"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Shortcut</label>
                <Input
                  placeholder="e.g., /followup"
                  value={shortcut}
                  onChange={(e) => setShortcut(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Type this in email fields to insert template
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Subject (Optional)
                </label>
                <Input
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Body</label>
                <Textarea
                  placeholder="Hi {name},&#10;&#10;Hope you're doing well...&#10;&#10;Use {variableName} for variables"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-1 min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {"{variable}"} syntax for dynamic content
                </p>
              </div>

              {extractVariables(body).length > 0 && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">
                    Detected Variables:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {extractVariables(body).map((variable) => (
                      <span
                        key={variable}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />
          <div className="p-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditingTemplate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !shortcut.trim() || !body.trim()}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Template
            </Button>
          </div>
        </div>
      ) : (
        /* Templates List */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Category Filter */}
          <div className="border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📋 All Categories</SelectItem>
                  {TEMPLATE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground ml-auto">
                {filteredTemplates.length} template
                {filteredTemplates.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {templates.length === 0
                      ? "No templates yet"
                      : `No ${filterCategory} templates`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {templates.length === 0
                      ? "Create reusable email templates"
                      : "Try a different category"}
                  </p>
                  {templates.length === 0 && (
                    <Button className="mt-4" onClick={handleNewTemplate}>
                      <Plus className="h-4 w-4 mr-1" />
                      Create First Template
                    </Button>
                  )}
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-sm transition-all"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {template.name}
                            {template.category && (
                              <span className="text-xs">
                                {
                                  TEMPLATE_CATEGORIES.find(
                                    (c) => c.value === template.category
                                  )?.icon
                                }
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Shortcut:{" "}
                            <code className="font-mono">
                              {template.shortcut}
                            </code>
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyTemplateToClipboard(template)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDelete(template.id!)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {template.subject && (
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-medium">Subject:</span>{" "}
                          {template.subject}
                        </p>
                      )}
                      <p className="text-sm line-clamp-3 text-muted-foreground">
                        {template.body}
                      </p>
                      {template.variables.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.variables.map((variable) => (
                            <span
                              key={variable}
                              className="text-xs bg-muted px-2 py-0.5 rounded"
                            >
                              {variable}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
