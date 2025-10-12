import { z } from "zod";

// Clipboard Types
export const ClipboardItemSchema = z.object({
  id: z.number().optional(),
  type: z.enum(["text", "url", "image"]),
  content: z.string(),
  pinned: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  timestamp: z.number(),
});

export type ClipboardItem = z.infer<typeof ClipboardItemSchema>;

// Note Types
export const NoteSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  content: z.string(),
  tags: z.array(z.string()).default([]),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Note = z.infer<typeof NoteSchema>;

// Email Template Types
export const EmailTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  shortcut: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  variables: z.array(z.string()).default([]),
  category: z.string().optional(),
  createdAt: z.number(),
});

export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;

// Screenshot Types
export const ScreenshotSchema = z.object({
  id: z.number().optional(),
  imageData: z.string(), // base64 or blob URL
  thumbnail: z.string().optional(),
  sourceUrl: z.string().optional(),
  annotations: z.string().optional(), // JSON string
  tags: z.array(z.string()).default([]),
  timestamp: z.number(),
});

export type Screenshot = z.infer<typeof ScreenshotSchema>;

// Message Types for Background Communication
export type MessageType =
  | "CLIPBOARD_COPIED"
  | "SAVE_NOTE"
  | "INSERT_TEMPLATE"
  | "CAPTURE_SCREENSHOT"
  | "GET_DATA";

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
