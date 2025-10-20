import type { ClipboardItem, Note, EmailTemplate, Screenshot } from "../types";

export interface ExportData {
  version: string;
  exportedAt: number;
  clipboard?: ClipboardItem[];
  notes?: Note[];
  templates?: EmailTemplate[];
  screenshots?: Screenshot[];
}

export const exportToJSON = (data: ExportData): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `workpilot-backup-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportTemplatesAsCSV = (templates: EmailTemplate[]): void => {
  const headers = [
    "Name",
    "Shortcut",
    "Subject",
    "Body",
    "Category",
    "Variables",
  ];
  const rows = templates.map((t) => [
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.shortcut}"`,
    `"${(t.subject || "").replace(/"/g, '""')}"`,
    `"${t.body.replace(/"/g, '""')}"`,
    `"${t.category || "general"}"`,
    `"${t.variables.join(", ")}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `workpilot-templates-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
