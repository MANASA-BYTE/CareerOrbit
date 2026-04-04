import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notesTable = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  folder: text("folder").notNull(),
  educationLevel: text("education_level"),
  description: text("description"),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  uploadedBy: text("uploaded_by"),
  downloads: integer("downloads").default(0),
  rating: real("rating").default(0),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notesTable).omit({ id: true, createdAt: true });
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notesTable.$inferSelect;
