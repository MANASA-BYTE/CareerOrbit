import { Router, type IRouter } from "express";
import { db, aiTrendsTable } from "@workspace/db";
import { GetAiTrendsResponse, ChatWithMentorBody, ChatWithMentorResponse } from "@workspace/api-zod";
import { stripNullsArray } from "../lib/nullstrip";

const router: IRouter = Router();

router.get("/ai/trending", async (_req, res): Promise<void> => {
  const trends = await db
    .select()
    .from(aiTrendsTable)
    .orderBy(aiTrendsTable.createdAt);

  res.json(GetAiTrendsResponse.parse(stripNullsArray(trends)));
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = ChatWithMentorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", message: parsed.error.message });
    return;
  }

  const { message, context = "general" } = parsed.data;

  const responses: Record<string, string[]> = {
    career: [
      `Great question about careers! Based on your interest in "${message.substring(0, 30)}...", I recommend exploring fields like Data Science, AI Engineering, or Full-Stack Development. India has a massive demand for skilled professionals in these areas.`,
      `For career guidance: Focus on building a strong foundation in mathematics and logical reasoning. Consider pursuing certifications from NASSCOM, NPTEL, or Coursera alongside your degree for better career prospects.`,
      `The Indian job market is evolving rapidly. Emerging sectors like AI, Electric Vehicles, Space Technology, and Renewable Energy offer excellent opportunities. Start skill-building early and keep updating your knowledge.`,
    ],
    exam: [
      `For competitive exams, consistent practice is key. Create a structured study plan: 3 months before exam - cover syllabus, 1 month before - practice previous year papers, 2 weeks before - revision only.`,
      `Important tip for government exams: Always check the official notification on the conducting body's website. Many aspirants miss out due to overlooking eligibility criteria or deadlines.`,
      `For UPSC, JEE, NEET, or other major exams: Join study groups, use NCERT books as foundation, and supplement with standard reference books. Mock tests are essential — take at least 2-3 per week.`,
    ],
    job: [
      `For job applications, your resume is your first impression. Tailor it for each application, highlight achievements with numbers, and keep it to 1-2 pages. LinkedIn profile is equally important.`,
      `Government jobs in India offer job security and benefits. Focus on SSC, UPSC, Banking exams, Railway recruitment, and PSU exams. Private sector offers higher pay and faster growth.`,
      `Skill up! In today's market, just a degree isn't enough. Add certifications in your domain, work on personal projects, contribute to open source, and build a portfolio that speaks for itself.`,
    ],
    study: [
      `Effective study technique: Use the Pomodoro method - 25 minutes focused study, 5 minutes break. After 4 sessions, take a longer 15-30 minute break. This maintains concentration and reduces fatigue.`,
      `Active recall and spaced repetition are scientifically proven study methods. Instead of re-reading, test yourself. Use apps like Anki for spaced repetition on formulas and key concepts.`,
      `For complex subjects, try the Feynman Technique: explain the concept as if teaching a 10-year-old. If you can't explain it simply, you don't understand it well enough yet.`,
    ],
    general: [
      `Welcome to EduPath! I'm your AI mentor. I can help you with career guidance, competitive exam strategies, job application tips, and study techniques. What would you like to explore today?`,
      `As a student in India today, you have incredible opportunities. The key is early planning, consistent effort, and staying updated with the latest trends. Don't just follow the crowd — identify your strengths and build a career around them.`,
      `Remember: Success in studies and career is a marathon, not a sprint. Take care of your mental health, maintain a balanced schedule, sleep well, and celebrate small wins. You've got this!`,
    ],
  };

  const contextResponses = responses[context] || responses.general;
  const reply = contextResponses[Math.floor(Math.random() * contextResponses.length)];

  const suggestions = [
    "Tell me about UPSC preparation strategy",
    "What are top careers in AI for 2025?",
    "How to apply for government jobs?",
    "Best study techniques for competitive exams",
  ];

  const relatedExams = context === "exam" || context === "career"
    ? ["UPSC Civil Services", "JEE Advanced", "NEET UG", "SSC CGL", "GATE"]
    : [];

  const relatedCareers = context === "career" || context === "job"
    ? ["Software Engineer", "Data Scientist", "IAS Officer", "Doctor", "Civil Engineer"]
    : [];

  res.json(
    ChatWithMentorResponse.parse({
      reply,
      suggestions,
      relatedExams,
      relatedCareers,
    })
  );
});

export default router;
