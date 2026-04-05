use rocket::serde::json::Json;
use rocket::{get, post, routes, Route, State};
use sqlx::PgPool;
use crate::errors::{internal_error, ApiResult};
use crate::models::{AiTrend, ChatBody, ChatResponse};

#[get("/ai/trending")]
pub async fn get_ai_trends(pool: &State<PgPool>) -> ApiResult<Vec<AiTrend>> {
    let trends = sqlx::query_as::<_, AiTrend>(
        r#"SELECT id, title, category, description, impact, readiness_year,
               COALESCE(skills, ARRAY[]::text[]) AS skills,
               COALESCE(careers, ARRAY[]::text[]) AS careers,
               icon_url, is_boom, created_at
           FROM ai_trends ORDER BY created_at"#,
    )
    .fetch_all(pool.inner())
    .await
    .map_err(internal_error)?;
    Ok(Json(trends))
}

#[post("/ai/chat", data = "<body>")]
pub async fn chat_with_mentor(_pool: &State<PgPool>, body: Json<ChatBody>) -> ApiResult<ChatResponse> {
    let context = body.context.as_deref().unwrap_or("general");
    let msg_preview = &body.message[..body.message.len().min(30)];

    let replies: &[&str] = match context {
        "career" => &[
            "Great question about careers! Based on your interest, explore fields like Data Science, AI Engineering, or Full-Stack Development. India has massive demand for skilled professionals in these areas.",
            "For career guidance: Focus on building a strong foundation in mathematics and logical reasoning. Pursue certifications from NASSCOM, NPTEL, or Coursera alongside your degree.",
            "The Indian job market is evolving rapidly. Sectors like AI, Electric Vehicles, Space Technology, and Renewable Energy offer excellent opportunities. Start skill-building early!",
        ],
        "exam" => &[
            "For competitive exams, consistent practice is key. Create a study plan: 3 months before — cover syllabus; 1 month before — practice previous year papers; 2 weeks before — revision only.",
            "Always check official notifications on the conducting body's website. Many aspirants miss out due to overlooking eligibility criteria or application deadlines.",
            "For UPSC, JEE, NEET, or other major exams: Join study groups, use NCERT books as foundation, and supplement with standard reference books. Take 2-3 mock tests per week.",
        ],
        "job" => &[
            "For job applications, your resume is your first impression. Tailor it for each application, highlight achievements with numbers, and keep it to 1-2 pages. LinkedIn is equally important.",
            "Government jobs in India offer security and benefits. Focus on SSC, UPSC, Banking exams, Railway recruitment, and PSU exams. Private sector offers higher pay and faster growth.",
            "Skill up! In today's market, just a degree isn't enough. Add certifications, work on personal projects, contribute to open source, and build a portfolio that speaks for itself.",
        ],
        "study" => &[
            "Use the Pomodoro method: 25 minutes focused study, 5 minutes break. After 4 sessions, take a 15-30 minute break. This maintains concentration and reduces fatigue.",
            "Active recall and spaced repetition are scientifically proven study methods. Instead of re-reading, test yourself. Use apps like Anki for spaced repetition on formulas and key concepts.",
            "Try the Feynman Technique: explain the concept as if teaching a 10-year-old. If you can't explain it simply, you don't understand it well enough yet.",
        ],
        _ => &[
            "Welcome to EduPath! I can help you with career guidance, competitive exam strategies, job application tips, and study techniques. What would you like to explore today?",
            "As a student in India today, you have incredible opportunities. The key is early planning, consistent effort, and staying updated with the latest trends.",
            "Success in studies and career is a marathon, not a sprint. Take care of your mental health, maintain a balanced schedule, sleep well, and celebrate small wins. You've got this!",
        ],
    };

    let idx = (body.message.len() + msg_preview.len()) % replies.len();
    let reply = replies[idx].to_string();

    let related_exams = if context == "exam" || context == "career" {
        vec![
            "UPSC Civil Services".to_string(),
            "JEE Advanced".to_string(),
            "NEET UG".to_string(),
            "SSC CGL".to_string(),
            "GATE".to_string(),
        ]
    } else {
        vec![]
    };

    let related_careers = if context == "career" || context == "job" {
        vec![
            "Software Engineer".to_string(),
            "Data Scientist".to_string(),
            "IAS Officer".to_string(),
            "Doctor".to_string(),
            "Civil Engineer".to_string(),
        ]
    } else {
        vec![]
    };

    Ok(Json(ChatResponse {
        reply,
        suggestions: vec![
            "Tell me about UPSC preparation strategy".to_string(),
            "What are top careers in AI for 2025?".to_string(),
            "How to apply for government jobs?".to_string(),
            "Best study techniques for competitive exams".to_string(),
        ],
        related_exams,
        related_careers,
    }))
}

pub fn routes() -> Vec<Route> {
    routes![get_ai_trends, chat_with_mentor]
}
