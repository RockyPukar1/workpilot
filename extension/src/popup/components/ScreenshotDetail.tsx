import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Trash2, Copy, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useScreenshots } from "@/shared/hooks/useScreenshots";

export function ScreenshotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { screenshots, deleteScreenshot } = useScreenshots();

  const screenshot = screenshots.find((s) => s.id === parseInt(id || "0"));

  useEffect(() => {
    if (!screenshot && id) {
      // Screenshot not found, redirect back
      navigate("/screenshots");
    }
  }, [screenshot, id, navigate]);

  const handleDelete = () => {
    if (!screenshot?.id || !confirm("Delete this screenshot?")) return;

    deleteScreenshot(screenshot.id);
    navigate("/screenshots");
  };

  const handleCopy = async () => {
    if (!screenshot?.imageData) return;

    try {
      const response = await fetch(screenshot.imageData);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      alert("Screenshot copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDownload = () => {
    if (!screenshot?.imageData) return;

    const link = document.createElement("a");
    link.href = screenshot.imageData;
    link.download = `screenshot-${screenshot.id}.png`;
    link.click();
  };

  if (!screenshot) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Screenshot not found</p>
        <Button className="mt-4" onClick={() => navigate("/screenshots")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Screenshots
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
            onClick={() => navigate("/screenshots")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Screenshot Details</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div>
          <p className="text-xs text-muted-foreground">
            Captured on {new Date(screenshot.timestamp).toLocaleString()}
          </p>
          {screenshot.sourceUrl && (
            <p className="text-xs text-muted-foreground mt-1">
              From: {screenshot.sourceUrl}
            </p>
          )}
        </div>

        {/* Image Preview */}
        <div className="border rounded-lg overflow-hidden bg-muted">
          <img
            src={screenshot.imageData}
            alt="Screenshot"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
