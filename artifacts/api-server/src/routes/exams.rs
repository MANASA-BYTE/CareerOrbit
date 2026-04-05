use rocket::serde::json::Json;
use rocket::{get, routes, Route, State};
use rocket::form::FromForm;
use sqlx::PgPool;
use crate::errors::{internal_error, not_found_error, ApiResult};
use crate::models::Exam;

const EXAM_SELECT: &str = r#"
    SELECT id, name, full_name, category, education_level, conducting_body,
        application_start_date, application_end_date, exam_date, result_date,
        application_fee, official_website, logo_url, total_vacancies, state,
        is_national, is_urgent, status, description, eligibility, syllabus,
        syllabus_url, application_procedure,
        COALESCE(required_documents, ARRAY[]::text[]) AS required_documents,
        exam_pattern,
        COALESCE(previous_year_papers, ARRAY[]::text[]) AS previous_year_papers,
        created_at
    FROM exams
"#;

#[derive(FromForm)]
pub struct ExamQuery {
    category: Option<String>,
    #[field(name = "educationLevel")]
    education_level: Option<String>,
    search: Option<String>,
}

#[get("/exams/upcoming")]
pub async fn upcoming_exams(pool: &State<PgPool>) -> ApiResult<Vec<Exam>> {
    let sql = format!(
        "{} WHERE status IN ('upcoming', 'open') ORDER BY created_at LIMIT 10",
        EXAM_SELECT
    );
    let exams = sqlx::query_as::<_, Exam>(&sql)
        .fetch_all(pool.inner())
        .await
        .map_err(internal_error)?;
    Ok(Json(exams))
}

#[get("/exams?<q..>")]
pub async fn list_exams(pool: &State<PgPool>, q: ExamQuery) -> ApiResult<Vec<Exam>> {
    let search_pattern = q.search.as_deref().map(|s| format!("%{}%", s));
    let sql = format!(
        r#"{} WHERE ($1::text IS NULL OR category = $1)
           AND ($2::text IS NULL OR education_level = $2)
           AND ($3::text IS NULL OR (name ILIKE $3 OR full_name ILIKE $3 OR conducting_body ILIKE $3))
           ORDER BY created_at"#,
        EXAM_SELECT
    );
    let exams = sqlx::query_as::<_, Exam>(&sql)
        .bind(q.category)
        .bind(q.education_level)
        .bind(search_pattern)
        .fetch_all(pool.inner())
        .await
        .map_err(internal_error)?;
    Ok(Json(exams))
}

#[get("/exams/<id>")]
pub async fn get_exam(pool: &State<PgPool>, id: i32) -> ApiResult<Exam> {
    let sql = format!("{} WHERE id = $1", EXAM_SELECT);
    let exam = sqlx::query_as::<_, Exam>(&sql)
        .bind(id)
        .fetch_optional(pool.inner())
        .await
        .map_err(internal_error)?
        .ok_or_else(|| not_found_error("Exam not found"))?;
    Ok(Json(exam))
}

pub fn routes() -> Vec<Route> {
    routes![upcoming_exams, list_exams, get_exam]
}
