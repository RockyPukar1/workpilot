import { useNavigate } from "react-router-dom";
import {
  Clipboard,
  StickyNote,
  Mail,
  Camera,
  ArrowRight,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useClipboard } from "@/shared/hooks/useClipboard";
import { useNotes } from "@/shared/hooks/useNotes";
import { useTemplates } from "@/shared/hooks/useTemplates";
import { useScreenshots } from "@/shared/hooks/useScreenshots";

const features = [
  {
    id: "clipboard" as const,
    name: "Clipboard Manager",
    description: "Smart clipboard history",
    icon: Clipboard,
    shortcut: "Alt+C",
  },
  {
    id: "notes" as const,
    name: "Quick Notes",
    description: "Fast note-taking",
    icon: StickyNote,
    shortcut: "Alt+N",
  },
  {
    id: "templates" as const,
    name: "Email Templates",
    description: "Reusable templates",
    icon: Mail,
    shortcut: "",
  },
  {
    id: "screenshots" as const,
    name: "Screenshots",
    description: "Capture & annotate",
    icon: Camera,
    shortcut: "Alt+S",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { items: clipboardItems } = useClipboard();
  const { notes } = useNotes();
  const { templates } = useTemplates();
  const { screenshots } = useScreenshots();

  console.log(clipboardItems);

  const getCounts = (id: string) => {
    switch (id) {
      case "clipboard":
        return clipboardItems.length;
      case "notes":
        return notes.length;
      case "templates":
        return templates.length;
      case "screenshots":
        return screenshots.length;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">WorkPilot</h1>
            <p className="text-sm text-muted-foreground">
              Corporate Productivity Suite
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const count = getCounts(feature.id);

            return (
              <Card
                key={feature.id}
                className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                onClick={() => navigate(`/${feature.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    {count > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    {feature.shortcut && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {feature.shortcut}
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {clipboardItems.length}
                </p>
                <p className="text-xs text-muted-foreground">Clipboard Items</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {notes.length}
                </p>
                <p className="text-xs text-muted-foreground">Notes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {templates.length}
                </p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {screenshots.length}
                </p>
                <p className="text-xs text-muted-foreground">Screenshots</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-3 bg-muted/30">
        <p className="text-xs text-center text-muted-foreground">
          Press shortcuts or click cards to access features
        </p>
      </div>
    </div>
  );
}
