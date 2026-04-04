import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const careersTable = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  description: text("description"),
  educationRequired: text("education_required"),
  averageSalary: text("average_salary"),
  growthRate: text("growth_rate"),
  jobDemand: text("job_demand").notNull().default("moderate"),
  skills: text("skills").array().default([]),
  topCompanies: text("top_companies").array().default([]),
  relatedExams: text("related_exams").array().default([]),
  roadmap: text("roadmap").array().default([]),
  iconUrl: text("icon_url"),
  isTrending: boolean("is_trending").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCareerSchema = createInsertSchema(careersTable).omit({ id: true, createdAt: true });
export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type Career = typeof careersTable.$inferSelect;
