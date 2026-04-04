import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import {
  GetProfileQueryParams,
  GetProfileResponse,
  CreateProfileBody,
  UpdateProfileParams,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";
import { stripNulls } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/profile", async (req, res): Promise<void> => {
  const params = GetProfileQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const [student] = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.aparId, params.data.aparId));

  if (!student) {
    res.status(404).json({ error: "not_found", message: "Profile not found" });
    return;
  }

  res.json(GetProfileResponse.parse(stripNulls(student)));
});

router.post("/profile", async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", message: parsed.error.message });
    return;
  }

  const existing = await db
    .select()
    .from(studentsTable)
    .where(eq(studentsTable.aparId, parsed.data.aparId));

  if (existing.length > 0) {
    res.status(409).json({ error: "conflict", message: "Profile with this APAAR ID already exists" });
    return;
  }

  const [student] = await db
    .insert(studentsTable)
    .values({
      aparId: parsed.data.aparId,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      educationLevel: parsed.data.educationLevel,
      currentClass: parsed.data.currentClass ?? null,
      school: parsed.data.school ?? null,
      state: parsed.data.state ?? null,
      district: parsed.data.district ?? null,
      careerInterests: parsed.data.careerInterests ?? [],
      targetExams: parsed.data.targetExams ?? [],
    })
    .returning();

  res.status(201).json(GetProfileResponse.parse(stripNulls(student)));
});

router.put("/profile/:id", async (req, res): Promise<void> => {
  const params = UpdateProfileParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", message: parsed.error.message });
    return;
  }

  const [student] = await db
    .update(studentsTable)
    .set({
      ...(parsed.data.name && { name: parsed.data.name }),
      ...(parsed.data.email !== undefined && { email: parsed.data.email }),
      ...(parsed.data.phone !== undefined && { phone: parsed.data.phone }),
      ...(parsed.data.educationLevel && { educationLevel: parsed.data.educationLevel }),
      ...(parsed.data.currentClass !== undefined && { currentClass: parsed.data.currentClass }),
      ...(parsed.data.school !== undefined && { school: parsed.data.school }),
      ...(parsed.data.state !== undefined && { state: parsed.data.state }),
      ...(parsed.data.district !== undefined && { district: parsed.data.district }),
      ...(parsed.data.careerInterests !== undefined && { careerInterests: parsed.data.careerInterests }),
      ...(parsed.data.targetExams !== undefined && { targetExams: parsed.data.targetExams }),
    })
    .where(eq(studentsTable.id, params.data.id))
    .returning();

  if (!student) {
    res.status(404).json({ error: "not_found", message: "Profile not found" });
    return;
  }

  res.json(UpdateProfileResponse.parse(stripNulls(student)));
});

export default router;
