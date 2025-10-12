import { useState } from "react";
import { ArrowLeft, Camera, Trash2, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Card } from "@/shared/components/ui/card";
import { useAppStore } from "@/shared/store";
import { useScreenshots } from "@/shared/hooks/useScreenshots";
import { format } from "date-fns";

export function ScreenCapture() {
  const setCurrentView = useAppStore((state) => state.setCurrentView);
  const { screenshots, addScreenshot, deleteScreenshot, clearAll } =
    useScreenshots();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    try {
      setIsCapturing(true);

      // Get current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab found");
      }

      // Capture visible tab
      const dataUrl = await chrome.tabs.captureVisibleTab({
        format: "png",
      });

      // Save screenshot
      const now = Date.now();
      addScreenshot({
        imageData: dataUrl,
        sourceUrl: tab.url,
        timestamp: now,
        tags: [],
      });

      setIsCapturing(false);
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
      setIsCapturing(false);
    }
  };

  const handleDownload = (screenshot: any) => {
    const link = document.createElement("a");
    link.href = screenshot.imageData;
    link.download = `screenshot-${screenshot.timestamp}.png`;
    link.click();
  };

  const handleDelete = (id: number) => {
    deleteScreenshot(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView("dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Screen Capture</h2>
              <p className="text-xs text-muted-foreground">
                {screenshots.length} screenshots
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-b px-4 py-3 space-y-2">
        <Button
          className="w-full"
          onClick={handleCapture}
          disabled={isCapturing}
        >
          <Camera className="h-4 w-4 mr-2" />
          {isCapturing ? "Capturing..." : "Capture Current Tab"}
        </Button>
        {screenshots.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => clearAll()}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Screenshots
          </Button>
        )}
      </div>

      {/* Screenshots Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {screenshots.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No screenshots yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Capture your screen to get started
              </p>
              <Button className="mt-4" onClick={handleCapture}>
                <Camera className="h-4 w-4 mr-1" />
                Take Screenshot
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {screenshots.map((screenshot) => (
                <Card
                  key={screenshot.id}
                  className="overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={screenshot.imageData}
                      alt="Screenshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDownload(screenshot)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDelete(screenshot.id!)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground">
                      {format(screenshot.timestamp, "MMM d, h:mm a")}
                    </p>
                    {screenshot.sourceUrl && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {new URL(screenshot.sourceUrl).hostname}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Info Footer */}
      <div className="border-t px-4 py-2 bg-muted/30">
        <p className="text-xs text-center text-muted-foreground">
          Tip: Use{" "}
          <kbd className="px-1.5 py-0.5 text-xs border rounded">Alt+S</kbd> for
          quick capture
        </p>
      </div>
    </div>
  );
}
