import { useEffect } from "react";
import { QueryProvider } from "@/shared/components/query-provider";
import { Popup } from "./Popup";
import { clipboardStorage } from "@/shared/utils/storage";
import { useQueryClient } from "@tanstack/react-query";

// Component that handles background messages - must be inside QueryProvider
function MessageHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load any clipboard items from chrome.storage.local on popup open
    const loadStoredClipboardItems = async () => {
      try {
        const result = await chrome.storage.local.get();
        const clipboardItems = Object.values(result).filter(
          (item: any) =>
            item && typeof item === "object" && item.type && item.content
        );

        if (clipboardItems.length > 0) {
          console.log("Found stored clipboard items:", clipboardItems);
          // Save each item to IndexedDB
          for (const item of clipboardItems) {
            await clipboardStorage.add(item);
          }
          // Clear from chrome.storage.local
          await chrome.storage.local.clear();
          // Invalidate cache to refresh UI
          queryClient.invalidateQueries({ queryKey: ["clipboard"] });
        }
      } catch (error) {
        console.log("No stored clipboard items found:", error);
      }
    };

    // Load stored items when popup opens
    loadStoredClipboardItems();

    // Listen for messages from background script
    const handleMessage = (message: any) => {
      console.log("Popup received message:", message);
      if (message.type === "SAVE_CLIPBOARD_ITEM" && message.payload) {
        console.log("Saving clipboard item:", message.payload);
        // Save the clipboard item to IndexedDB
        clipboardStorage
          .add(message.payload)
          .then(() => {
            console.log("Clipboard item saved, invalidating cache");
            // Invalidate and refetch clipboard query to update UI immediately
            queryClient.invalidateQueries({ queryKey: ["clipboard"] });
          })
          .catch((error) => {
            console.error("Failed to save clipboard item:", error);
          });
      } else {
        console.log("Ignoring message:", message);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [queryClient]);

  return null; // This component doesn't render anything
}

function App() {
  return (
    <QueryProvider>
      <MessageHandler />
      <Popup />
    </QueryProvider>
  );
}

export default App;
