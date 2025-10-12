// Content script for WorkPilot
// Injected into Gmail and Outlook to enable email template insertion

console.log("WorkPilot content script loaded");

// Listen for template insertion shortcuts
let isListening = false;

function startListening() {
  if (isListening) return;
  isListening = true;

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("input", handleInput);
}

function handleKeyDown(e: KeyboardEvent) {
  // Handle keyboard shortcuts
  if (e.altKey && e.key === "t") {
    e.preventDefault();
    showTemplateMenu();
  }
}

function handleInput(e: Event) {
  const target = e.target as HTMLElement;

  // Check if user is typing in an email compose field
  if (isEmailField(target)) {
    const text = target.textContent || "";

    // Check for template shortcut (e.g., /followup)
    const match = text.match(/\/(\w+)$/);
    if (match) {
      const shortcut = match[1];
      loadAndInsertTemplate(shortcut, target);
    }
  }
}

function isEmailField(element: HTMLElement): boolean {
  // Check if element is Gmail or Outlook compose field
  const isContentEditable = element.isContentEditable;
  const isTextarea = element.tagName === "TEXTAREA";
  const hasEmailClass =
    element.classList.contains("editable") ||
    element.classList.contains("Am") || // Gmail
    element.getAttribute("role") === "textbox";

  return isContentEditable || isTextarea || hasEmailClass;
}

async function loadAndInsertTemplate(shortcut: string, target: HTMLElement) {
  try {
    // Request template from background script
    const response = await chrome.runtime.sendMessage({
      type: "GET_TEMPLATE",
      payload: { shortcut },
    });

    if (response.success && response.data) {
      insertTemplate(response.data, target);
    }
  } catch (error) {
    console.error("Failed to load template:", error);
  }
}

function insertTemplate(template: any, target: HTMLElement) {
  // Replace the shortcut with template content
  const text = target.textContent || "";
  const newText = text.replace(/\/\w+$/, template.body);

  if (target.isContentEditable) {
    target.textContent = newText;
  } else if (target instanceof HTMLTextAreaElement) {
    target.value = newText;
  }

  // Trigger input event
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

function showTemplateMenu() {
  // Show a floating menu with available templates
  // This would be implemented in a future version
  console.log("Show template menu");
}

// Initialize
startListening();

// Message listener
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "INSERT_TEMPLATE") {
    const activeElement = document.activeElement as HTMLElement;
    if (isEmailField(activeElement)) {
      insertTemplate(request.payload, activeElement);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: "No email field focused" });
    }
  }
});
