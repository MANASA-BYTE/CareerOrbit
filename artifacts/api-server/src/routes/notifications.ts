import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import {
  ListNotificationsQueryParams,
  ListNotificationsResponse,
} from "@workspace/api-zod";
import { stripNullsArray } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/notifications", async (req, res): Promise<void> => {
  const params = ListNotificationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.type) {
    conditions.push(eq(notificationsTable.type, params.data.type));
  }

  const notifications = await db
    .select()
    .from(notificationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(notificationsTable.createdAt);

  res.json(ListNotificationsResponse.parse(stripNullsArray(notifications)));
});

export default router;
