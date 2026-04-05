use rocket::serde::json::Json;
use rocket::{get, routes, Route, State};
use rocket::form::FromForm;
use sqlx::PgPool;
use crate::errors::{internal_error, not_found_error, ApiResult};
use crate::models::Job;

const JOB_SELECT: &str = r#"
    SELECT id, title, organization, sector, category, location, state,
        education_level, vacancies, salary_min, salary_max, salary_text,
        application_deadline, application_url, logo_url, is_trending, is_urgent,
        status, description, eligibility,
        COALESCE(tags, ARRAY[]::text[]) AS tags,
        posted_at, created_at
    FROM jobs
"#;

#[derive(FromForm)]
pub struct JobQuery {
    sector: Option<String>,
    category: Option<String>,
    state: Option<String>,
    #[field(name = "educationLevel")]
    education_level: Option<String>,
    search: Option<String>,
}

#[get("/jobs/trending")]
pub async fn trending_jobs(pool: &State<PgPool>) -> ApiResult<Vec<Job>> {
    let sql = format!(
        "{} WHERE is_trending = true ORDER BY created_at LIMIT 10",
        JOB_SELECT
    );
    let jobs = sqlx::query_as::<_, Job>(&sql)
        .fetch_all(pool.inner())
        .await
        .map_err(internal_error)?;
    Ok(Json(jobs))
}

#[get("/jobs?<q..>")]
pub async fn list_jobs(pool: &State<PgPool>, q: JobQuery) -> ApiResult<Vec<Job>> {
    let search_pattern = q.search.as_deref().map(|s| format!("%{}%", s));
    let sql = format!(
        r#"{} WHERE ($1::text IS NULL OR sector = $1)
           AND ($2::text IS NULL OR category ILIKE $2)
           AND ($3::text IS NULL OR state = $3)
           AND ($4::text IS NULL OR education_level = $4)
           AND ($5::text IS NULL OR (title ILIKE $5 OR organization ILIKE $5))
           ORDER BY created_at"#,
        JOB_SELECT
    );
    let jobs = sqlx::query_as::<_, Job>(&sql)
        .bind(q.sector)
        .bind(q.category.as_deref().map(|c| format!("%{}%", c)))
        .bind(q.state)
        .bind(q.education_level)
        .bind(search_pattern)
        .fetch_all(pool.inner())
        .await
        .map_err(internal_error)?;
    Ok(Json(jobs))
}

#[get("/jobs/<id>")]
pub async fn get_job(pool: &State<PgPool>, id: i32) -> ApiResult<Job> {
    let sql = format!("{} WHERE id = $1", JOB_SELECT);
    let job = sqlx::query_as::<_, Job>(&sql)
        .bind(id)
        .fetch_optional(pool.inner())
        .await
        .map_err(internal_error)?
        .ok_or_else(|| not_found_error("Job not found"))?;
    Ok(Json(job))
}

pub fn routes() -> Vec<Route> {
    routes![trending_jobs, list_jobs, get_job]
}
