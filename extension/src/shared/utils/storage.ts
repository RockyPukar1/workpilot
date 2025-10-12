import { db } from "../db";
import type { ClipboardItem, Note, EmailTemplate, Screenshot } from "../types";

// Clipboard Operations
export const clipboardStorage = {
  async getAll(): Promise<ClipboardItem[]> {
    return await db.clipboard.orderBy("timestamp").reverse().toArray();
  },

  async add(item: Omit<ClipboardItem, "id">): Promise<number> {
    const id = await db.clipboard.add(item as ClipboardItem);
    return id as number;
  },

  async update(id: number, changes: Partial<ClipboardItem>): Promise<number> {
    return await db.clipboard.update(id, changes);
  },

  async delete(id: number): Promise<void> {
    await db.clipboard.delete(id);
  },

  async clear(): Promise<void> {
    await db.clipboard.clear();
  },

  async getPinned(): Promise<ClipboardItem[]> {
    return await db.clipboard.where("pinned").equals(1).toArray();
  },
};

// Notes Operations
export const notesStorage = {
  async getAll(): Promise<Note[]> {
    return await db.notes.orderBy("updatedAt").reverse().toArray();
  },

  async add(note: Omit<Note, "id">): Promise<number> {
    const id = await db.notes.add(note as Note);
    return id as number;
  },

  async update(id: number, changes: Partial<Note>): Promise<number> {
    return await db.notes.update(id, { ...changes, updatedAt: Date.now() });
  },

  async delete(id: number): Promise<void> {
    await db.notes.delete(id);
  },

  async get(id: number): Promise<Note | undefined> {
    return await db.notes.get(id);
  },
};

// Templates Operations
export const templatesStorage = {
  async getAll(): Promise<EmailTemplate[]> {
    return await db.templates.toArray();
  },

  async add(template: Omit<EmailTemplate, "id">): Promise<number> {
    const id = await db.templates.add(template as EmailTemplate);
    return id as number;
  },

  async update(id: number, changes: Partial<EmailTemplate>): Promise<number> {
    return await db.templates.update(id, changes);
  },

  async delete(id: number): Promise<void> {
    await db.templates.delete(id);
  },

  async getByShortcut(shortcut: string): Promise<EmailTemplate | undefined> {
    return await db.templates.where("shortcut").equals(shortcut).first();
  },
};

// Screenshots Operations
export const screenshotsStorage = {
  async getAll(): Promise<Screenshot[]> {
    return await db.screenshots.orderBy("timestamp").reverse().toArray();
  },

  async add(screenshot: Omit<Screenshot, "id">): Promise<number> {
    const id = await db.screenshots.add(screenshot as Screenshot);
    return id as number;
  },

  async delete(id: number): Promise<void> {
    await db.screenshots.delete(id);
  },

  async clear(): Promise<void> {
    await db.screenshots.clear();
  },
};
