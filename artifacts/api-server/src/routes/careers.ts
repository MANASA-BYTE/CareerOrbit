import { Router, type IRouter } from "express";
import { eq, and, ilike } from "drizzle-orm";
import { db, careersTable } from "@workspace/db";
import {
  ListCareersQueryParams,
  ListCareersResponse,
  GetCareerResponse,
} from "@workspace/api-zod";
import { stripNulls, stripNullsArray } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/careers", async (req, res): Promise<void> => {
  const params = ListCareersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.domain) {
    conditions.push(ilike(careersTable.domain, `%${params.data.domain}%`));
  }
  if (params.data.educationLevel) {
    conditions.push(ilike(careersTable.educationRequired, `%${params.data.educationLevel}%`));
  }

  const careers = await db
    .select()
    .from(careersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(careersTable.createdAt);

  res.json(ListCareersResponse.parse(stripNullsArray(careers)));
});

router.get("/careers/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "invalid_params", message: "Invalid career ID" });
    return;
  }

  const [career] = await db
    .select()
    .from(careersTable)
    .where(eq(careersTable.id, id));

  if (!career) {
    res.status(404).json({ error: "not_found", message: "Career not found" });
    return;
  }

  res.json(GetCareerResponse.parse(stripNulls(career)));
});

export default router;
