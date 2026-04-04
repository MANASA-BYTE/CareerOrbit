import { Router, type IRouter } from "express";
import { eq, and, ilike, or } from "drizzle-orm";
import { db, examsTable } from "@workspace/db";
import {
  ListExamsQueryParams,
  ListExamsResponse,
  GetExamResponse,
  GetUpcomingExamsResponse,
} from "@workspace/api-zod";
import { stripNulls, stripNullsArray } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/exams/upcoming", async (req, res): Promise<void> => {
  const exams = await db
    .select()
    .from(examsTable)
    .where(
      or(
        eq(examsTable.status, "upcoming"),
        eq(examsTable.status, "open")
      )
    )
    .limit(10);

  res.json(GetUpcomingExamsResponse.parse(stripNullsArray(exams)));
});

router.get("/exams", async (req, res): Promise<void> => {
  const params = ListExamsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.category) {
    conditions.push(eq(examsTable.category, params.data.category));
  }
  if (params.data.educationLevel) {
    conditions.push(eq(examsTable.educationLevel, params.data.educationLevel));
  }
  if (params.data.search) {
    conditions.push(
      or(
        ilike(examsTable.name, `%${params.data.search}%`),
        ilike(examsTable.fullName, `%${params.data.search}%`),
        ilike(examsTable.conductingBody, `%${params.data.search}%`)
      )
    );
  }

  const exams = await db
    .select()
    .from(examsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(examsTable.createdAt);

  res.json(ListExamsResponse.parse(stripNullsArray(exams)));
});

router.get("/exams/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "invalid_params", message: "Invalid exam ID" });
    return;
  }

  const [exam] = await db
    .select()
    .from(examsTable)
    .where(eq(examsTable.id, id));

  if (!exam) {
    res.status(404).json({ error: "not_found", message: "Exam not found" });
    return;
  }

  res.json(GetExamResponse.parse(stripNulls(exam)));
});

export default router;
