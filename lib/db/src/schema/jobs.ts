import { pgTable, text, serial, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  sector: text("sector").notNull(),
  category: text("category"),
  location: text("location"),
  state: text("state"),
  educationLevel: text("education_level"),
  vacancies: integer("vacancies"),
  salaryMin: real("salary_min"),
  salaryMax: real("salary_max"),
  salaryText: text("salary_text"),
  applicationDeadline: text("application_deadline"),
  applicationUrl: text("application_url"),
  logoUrl: text("logo_url"),
  isTrending: boolean("is_trending").default(false),
  isUrgent: boolean("is_urgent").default(false),
  status: text("status").notNull().default("open"),
  description: text("description"),
  eligibility: text("eligibility"),
  tags: text("tags").array().default([]),
  postedAt: timestamp("posted_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ id: true, createdAt: true, postedAt: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
