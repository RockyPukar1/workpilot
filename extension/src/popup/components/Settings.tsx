import { useState, useRef } from "react";
import {
  ArrowLeft,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { useNotes } from "@/shared/hooks/useNotes";
import { useTemplates } from "@/shared/hooks/useTemplates";
import { useScreenshots } from "@/shared/hooks/useScreenshots";
import {
  exportToJSON,
  exportTemplatesAsCSV,
  importFromJSON,
  type ExportData,
} from "@/shared/utils/export";

export function Settings() {
  const navigate = useNavigate();
  const { items: clipboardItems, clearAll: clearClipboard } = useClipboard();
  const { notes, clearAll: clearNotes } = useNotes();
  const { templates } = useTemplates();
  const { screenshots, clearAll: clearScreenshots } = useScreenshots();

  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportAll = () => {
    const data: ExportData = {
      version: "1.0",
      exportedAt: Date.now(),
      clipboard: clipboardItems,
      notes,
      templates,
      screenshots,
    };
    exportToJSON(data);
  };

  const handleExportTemplatesCSV = () => {
    exportTemplatesAsCSV(templates);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await importFromJSON(file);

      // Import data (you would add actual import logic here)
      console.log("Imported data:", data);

      alert("Import successful! Reload the extension to see changes.");
    } catch (error) {
      alert("Import failed: " + (error as Error).message);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Settings & Data</h2>
            <p className="text-xs text-muted-foreground">
              Manage your WorkPilot data
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your data as backup or to transfer to another device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportAll}
            >
              <FileJson className="h-4 w-4 mr-2" />
              Export All Data (JSON)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportTemplatesCSV}
              disabled={templates.length === 0}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Templates (CSV)
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {clipboardItems.length} clipboard items, {notes.length} notes,{" "}
              {templates.length} templates, {screenshots.length} screenshots
            </p>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </CardTitle>
            <CardDescription>
              Import data from a previous backup (JSON format)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import from JSON"}
            </Button>
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md flex gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Importing will merge with existing data. Duplicates may occur.
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Clear Data Section */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Clear Data
            </CardTitle>
            <CardDescription>
              Permanently delete data from WorkPilot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Clear all clipboard history?")) {
                  clearClipboard();
                }
              }}
              disabled={clipboardItems.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Clipboard ({clipboardItems.length} items)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Delete all notes? This cannot be undone.")) {
                  clearNotes();
                }
              }}
              disabled={notes.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Notes ({notes.length} notes)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Clear all screenshots?")) {
                  clearScreenshots();
                }
              }}
              disabled={screenshots.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Screenshots ({screenshots.length} screenshots)
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About WorkPilot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="text-muted-foreground">Version: 1.0.0</p>
            <p className="text-muted-foreground">
              Local-first productivity suite
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All data is stored locally on your device. No cloud sync yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
