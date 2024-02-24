import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const $notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  editorState: text("editor_state"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type NoteType = typeof $notes.$inferInsert;
