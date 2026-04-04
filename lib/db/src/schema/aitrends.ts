import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiTrendsTable = pgTable("ai_trends", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  impact: text("impact").notNull().default("high"),
  readinessYear: integer("readiness_year"),
  skills: text("skills").array().default([]),
  careers: text("careers").array().default([]),
  iconUrl: text("icon_url"),
  isBoom: boolean("is_boom").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiTrendSchema = createInsertSchema(aiTrendsTable).omit({ id: true, createdAt: true });
export type InsertAiTrend = z.infer<typeof insertAiTrendSchema>;
export type AiTrend = typeof aiTrendsTable.$inferSelect;
