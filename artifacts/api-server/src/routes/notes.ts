import { Router, type IRouter } from "express";
import { eq, and, ilike, sql } from "drizzle-orm";
import { db, notesTable } from "@workspace/db";
import {
  ListNotesQueryParams,
  ListNotesResponse,
  CreateNoteBody,
  GetNoteResponse,
  GetNotesFoldersResponse,
} from "@workspace/api-zod";
import { stripNulls, stripNullsArray } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/notes/folders", async (_req, res): Promise<void> => {
  const folders = [
    { folder: "school_notes", label: "School Notes", icon: "book-open" },
    { folder: "college_notes", label: "College Notes", icon: "graduation-cap" },
    { folder: "competitive_notes", label: "Competitive Notes", icon: "target" },
    { folder: "exam_specific", label: "Exam Specific", icon: "file-text" },
  ];

  const counts = await db
    .select({ folder: notesTable.folder, count: sql<number>`count(*)::int` })
    .from(notesTable)
    .groupBy(notesTable.folder);

  const countMap: Record<string, number> = {};
  for (const c of counts) {
    countMap[c.folder] = c.count;
  }

  const result = folders.map((f) => ({
    ...f,
    count: countMap[f.folder] ?? 0,
  }));

  res.json(GetNotesFoldersResponse.parse(result));
});

router.get("/notes", async (req, res): Promise<void> => {
  const params = ListNotesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.folder) {
    conditions.push(eq(notesTable.folder, params.data.folder));
  }
  if (params.data.subject) {
    conditions.push(ilike(notesTable.subject, `%${params.data.subject}%`));
  }
  if (params.data.educationLevel) {
    conditions.push(eq(notesTable.educationLevel, params.data.educationLevel));
  }

  const notes = await db
    .select()
    .from(notesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(notesTable.createdAt);

  res.json(ListNotesResponse.parse(stripNullsArray(notes)));
});

router.post("/notes", async (req, res): Promise<void> => {
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", message: parsed.error.message });
    return;
  }

  const [note] = await db
    .insert(notesTable)
    .values({
      title: parsed.data.title,
      subject: parsed.data.subject,
      folder: parsed.data.folder,
      educationLevel: parsed.data.educationLevel ?? null,
      description: parsed.data.description ?? null,
      fileUrl: parsed.data.fileUrl ?? null,
      fileType: parsed.data.fileType ?? null,
      tags: parsed.data.tags ?? [],
    })
    .returning();

  res.status(201).json(GetNoteResponse.parse(stripNulls(note)));
});

router.get("/notes/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "invalid_params", message: "Invalid note ID" });
    return;
  }

  const [note] = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, id));

  if (!note) {
    res.status(404).json({ error: "not_found", message: "Note not found" });
    return;
  }

  res.json(GetNoteResponse.parse(stripNulls(note)));
});

export default router;
