import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import examsRouter from "./exams";
import notesRouter from "./notes";
import jobsRouter from "./jobs";
import careersRouter from "./careers";
import aiTrendsRouter from "./aitrends";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(examsRouter);
router.use(notesRouter);
router.use(jobsRouter);
router.use(careersRouter);
router.use(aiTrendsRouter);
router.use(notificationsRouter);
router.use(dashboardRouter);

export default router;
