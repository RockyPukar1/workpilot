import Dexie, { Table } from "dexie";
import type { ClipboardItem, Note, EmailTemplate, Screenshot } from "../types";

export class WorkPilotDB extends Dexie {
  clipboard!: Table<ClipboardItem>;
  notes!: Table<Note>;
  templates!: Table<EmailTemplate>;
  screenshots!: Table<Screenshot>;

  constructor() {
    super("WorkPilotDB");

    this.version(1).stores({
      clipboard: "++id, timestamp, pinned, type",
      notes: "++id, createdAt, updatedAt",
      templates: "++id, shortcut, category",
      screenshots: "++id, timestamp",
    });
  }
}

export const db = new WorkPilotDB();
