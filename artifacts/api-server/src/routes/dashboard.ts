import { Router, type IRouter } from "express";
import { eq, or } from "drizzle-orm";
import { db, examsTable, jobsTable, notesTable, careersTable, aiTrendsTable, notificationsTable } from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [examCounts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where status = 'open')::int`,
    })
    .from(examsTable);

  const [jobCounts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where status = 'open')::int`,
    })
    .from(jobsTable);

  const [noteCount] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(notesTable);

  const [careerCount] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(careersTable);

  const [aiCount] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(aiTrendsTable);

  const [notifCount] = await db
    .select({ total: sql<number>`count(*) filter (where is_new = true)::int` })
    .from(notificationsTable);

  const upcomingExams = await db
    .select({ name: examsTable.name, deadline: examsTable.applicationEndDate })
    .from(examsTable)
    .where(or(eq(examsTable.status, "upcoming"), eq(examsTable.status, "open")))
    .limit(5);

  const upcomingJobs = await db
    .select({ name: jobsTable.title, deadline: jobsTable.applicationDeadline })
    .from(jobsTable)
    .where(eq(jobsTable.status, "open"))
    .limit(3);

  const upcomingDeadlines = [
    ...upcomingExams.map((e) => ({ name: e.name, deadline: e.deadline ?? "TBD", type: "exam" })),
    ...upcomingJobs.map((j) => ({ name: j.name, deadline: j.deadline ?? "TBD", type: "job" })),
  ];

  res.json(
    GetDashboardSummaryResponse.parse({
      totalExams: examCounts?.total ?? 0,
      openExams: examCounts?.open ?? 0,
      totalJobs: jobCounts?.total ?? 0,
      openJobs: jobCounts?.open ?? 0,
      totalNotes: noteCount?.total ?? 0,
      totalCareers: careerCount?.total ?? 0,
      upcomingDeadlines,
      latestNotifications: notifCount?.total ?? 0,
      aiTrends: aiCount?.total ?? 0,
    })
  );
});

export default router;
