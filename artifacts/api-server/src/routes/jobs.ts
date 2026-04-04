import { Router, type IRouter } from "express";
import { eq, and, ilike, or } from "drizzle-orm";
import { db, jobsTable } from "@workspace/db";
import {
  ListJobsQueryParams,
  ListJobsResponse,
  GetJobResponse,
  GetTrendingJobsResponse,
} from "@workspace/api-zod";
import { stripNulls, stripNullsArray } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/jobs/trending", async (_req, res): Promise<void> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.isTrending, true))
    .limit(10);

  res.json(GetTrendingJobsResponse.parse(stripNullsArray(jobs)));
});

router.get("/jobs", async (req, res): Promise<void> => {
  const params = ListJobsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.sector) {
    conditions.push(eq(jobsTable.sector, params.data.sector));
  }
  if (params.data.category) {
    conditions.push(ilike(jobsTable.category, `%${params.data.category}%`));
  }
  if (params.data.state) {
    conditions.push(eq(jobsTable.state, params.data.state));
  }
  if (params.data.educationLevel) {
    conditions.push(eq(jobsTable.educationLevel, params.data.educationLevel));
  }
  if (params.data.search) {
    conditions.push(
      or(
        ilike(jobsTable.title, `%${params.data.search}%`),
        ilike(jobsTable.organization, `%${params.data.search}%`)
      )
    );
  }

  const jobs = await db
    .select()
    .from(jobsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(jobsTable.createdAt);

  res.json(ListJobsResponse.parse(stripNullsArray(jobs)));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "invalid_params", message: "Invalid job ID" });
    return;
  }

  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, id));

  if (!job) {
    res.status(404).json({ error: "not_found", message: "Job not found" });
    return;
  }

  res.json(GetJobResponse.parse(stripNulls(job)));
});

export default router;
