use rocket::serde::json::Json;
use rocket::{get, routes, Route, State};
use rocket::form::FromForm;
use sqlx::PgPool;
use crate::errors::{internal_error, not_found_error, ApiResult};
use crate::models::Career;

const CAREER_SELECT: &str = r#"
    SELECT id, title, domain, description, education_required, average_salary,
        growth_rate, job_demand,
        COALESCE(skills, ARRAY[]::text[]) AS skills,
        COALESCE(top_companies, ARRAY[]::text[]) AS top_companies,
        COALESCE(related_exams, ARRAY[]::text[]) AS related_exams,
        COALESCE(roadmap, ARRAY[]::text[]) AS roadmap,
        icon_url, is_trending, created_at
    FROM careers
"#;

#[derive(FromForm)]
pub struct CareerQuery {
    domain: Option<String>,
    #[field(name = "educationLevel")]
    education_level: Option<String>,
}

#[get("/careers?<q..>")]
pub async fn list_careers(pool: &State<PgPool>, q: CareerQuery) -> ApiResult<Vec<Career>> {
    let sql = format!(
        r#"{} WHERE ($1::text IS NULL OR domain ILIKE $1)
           AND ($2::text IS NULL OR education_required ILIKE $2)
           ORDER BY created_at"#,
        CAREER_SELECT
    );
    let careers = sqlx::query_as::<_, Career>(&sql)
        .bind(q.domain.as_deref().map(|d| format!("%{}%", d)))
        .bind(q.education_level.as_deref().map(|e| format!("%{}%", e)))
        .fetch_all(pool.inner())
        .await
        .map_err(internal_error)?;
    Ok(Json(careers))
}

#[get("/careers/<id>")]
pub async fn get_career(pool: &State<PgPool>, id: i32) -> ApiResult<Career> {
    let sql = format!("{} WHERE id = $1", CAREER_SELECT);
    let career = sqlx::query_as::<_, Career>(&sql)
        .bind(id)
        .fetch_optional(pool.inner())
        .await
        .map_err(internal_error)?
        .ok_or_else(|| not_found_error("Career not found"))?;
    Ok(Json(career))
}

pub fn routes() -> Vec<Route> {
    routes![list_careers, get_career]
}
