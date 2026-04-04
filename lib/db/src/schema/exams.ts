import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const examsTable = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name"),
  category: text("category").notNull(),
  educationLevel: text("education_level"),
  conductingBody: text("conducting_body"),
  applicationStartDate: text("application_start_date"),
  applicationEndDate: text("application_end_date"),
  examDate: text("exam_date"),
  resultDate: text("result_date"),
  applicationFee: text("application_fee"),
  officialWebsite: text("official_website"),
  logoUrl: text("logo_url"),
  totalVacancies: integer("total_vacancies"),
  state: text("state"),
  isNational: boolean("is_national").default(true),
  isUrgent: boolean("is_urgent").default(false),
  status: text("status").notNull().default("upcoming"),
  description: text("description"),
  eligibility: text("eligibility"),
  syllabus: text("syllabus"),
  syllabusUrl: text("syllabus_url"),
  applicationProcedure: text("application_procedure"),
  requiredDocuments: text("required_documents").array().default([]),
  examPattern: text("exam_pattern"),
  previousYearPapers: text("previous_year_papers").array().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExamSchema = createInsertSchema(examsTable).omit({ id: true, createdAt: true });
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof examsTable.$inferSelect;
