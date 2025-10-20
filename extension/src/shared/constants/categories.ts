export const TEMPLATE_CATEGORIES = [
  { value: "general", label: "General", icon: "📝" },
  { value: "sales", label: "Sales", icon: "💼" },
  { value: "support", label: "Support", icon: "🎧" },
  { value: "hr", label: "HR", icon: "👥" },
  { value: "marketing", label: "Marketing", icon: "📣" },
  { value: "product", label: "Product", icon: "🚀" },
  { value: "finance", label: "Finance", icon: "💰" },
  { value: "legal", label: "Legal", icon: "⚖️" },
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]["value"];
