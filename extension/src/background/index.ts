// Background Service Worker for WorkPilot

console.log("WorkPilot background service worker loaded");

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  console.log("WorkPilot installed:", details.reason);

  if (details.reason === "install") {
    // First time installation
    chrome.tabs.create({
      url: "https://github.com/workpilot/welcome",
    });
  }
});

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-clipboard",
    title: "Save to WorkPilot Clipboard",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "save-as-note",
    title: "Save as Quick Note",
    contexts: ["selection"],
  });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.menuItemId === "save-to-clipboard" && info.selectionText) {
    // Save selected text to clipboard history
    saveToClipboard(info.selectionText);
  } else if (info.menuItemId === "save-as-note" && info.selectionText) {
    // Save selected text as note
    saveAsNote(info.selectionText, info.pageUrl);
  }
});

// Keyboard commands
chrome.commands.onCommand.addListener((command) => {
  console.log("Command triggered:", command);

  switch (command) {
    case "open-clipboard":
      chrome.action.openPopup();
      break;
    case "open-notes":
      chrome.action.openPopup();
      break;
    case "take-screenshot":
      captureScreenshot();
      break;
  }
});

// Message handler
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log("Background received message:", request);

  switch (request.type) {
    case "CLIPBOARD_COPIED":
      if (request.payload && request.payload.content) {
        console.log("Processing clipboard content:", request.payload.content);
        saveToClipboard(request.payload.content);
        sendResponse({ success: true });
      } else {
        console.log("Invalid clipboard payload:", request.payload);
        sendResponse({ success: false, error: "Invalid payload" });
      }
      break;
    case "CAPTURE_SCREENSHOT":
      captureScreenshot().then((dataUrl) => {
        sendResponse({ success: true, data: dataUrl });
      });
      return true; // Keep channel open for async response
    default:
      console.log("Unknown message type:", request.type);
      sendResponse({ success: false, error: "Unknown message type" });
  }
});

// Helper functions
async function saveToClipboard(text: string) {
  try {
    const item = {
      type: isUrl(text) ? "url" : "text",
      content: text,
      pinned: false,
      tags: [],
      timestamp: Date.now(),
    };

    // Save directly to storage instead of sending message to popup
    // This avoids connection issues when popup is not open
    console.log("Saving clipboard item directly to storage:", item);

    // Save to chrome.storage.local as a backup
    const storageKey = `clipboard_${Date.now()}`;
    await chrome.storage.local.set({
      [storageKey]: item,
    });

    // Also try to send message to popup if it's open
    try {
      chrome.runtime.sendMessage(
        {
          type: "SAVE_CLIPBOARD_ITEM",
          payload: item,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log("Popup not available, saved to storage only");
          } else {
            console.log("Message sent to popup successfully");
          }
        }
      );
    } catch (error) {
      console.log("Could not send message to popup:", error);
    }

    console.log("Saved to clipboard:", item);
  } catch (error) {
    console.error("Failed to save to clipboard:", error);
  }
}

async function saveAsNote(text: string, sourceUrl?: string) {
  try {
    const note = {
      title: `Note from ${
        sourceUrl ? new URL(sourceUrl).hostname : "selection"
      }`,
      content: text,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log("Saving note:", note);
  } catch (error) {
    console.error("Failed to save note:", error);
  }
}

async function captureScreenshot() {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({
      format: "png",
    });
    return dataUrl;
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    throw error;
  }
}

function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

// Monitor clipboard changes (if permission granted)
// Note: This requires additional permissions and user interaction
