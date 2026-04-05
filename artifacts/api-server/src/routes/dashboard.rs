use rocket::serde::json::Json;
use rocket::{get, routes, Route, State};
use sqlx::PgPool;
use crate::errors::{internal_error, ApiResult};
use crate::models::{DashboardSummary, DeadlineItem};

#[derive(sqlx::FromRow)]
struct CountRow { total: i64, open: i64 }

#[derive(sqlx::FromRow)]
struct SingleCount { total: i64 }

#[derive(sqlx::FromRow)]
struct ExamDeadline { name: String, deadline: Option<String> }

#[derive(sqlx::FromRow)]
struct JobDeadline { name: String, deadline: Option<String> }

#[get("/dashboard/summary")]
pub async fn get_dashboard(pool: &State<PgPool>) -> ApiResult<DashboardSummary> {
    let exam_counts = sqlx::query_as::<_, CountRow>(
        "SELECT COUNT(*)::bigint AS total, COUNT(*) FILTER (WHERE status = 'open')::bigint AS open FROM exams"
    )
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    let job_counts = sqlx::query_as::<_, CountRow>(
        "SELECT COUNT(*)::bigint AS total, COUNT(*) FILTER (WHERE status = 'open')::bigint AS open FROM jobs"
    )
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    let note_count = sqlx::query_as::<_, SingleCount>(
        "SELECT COUNT(*)::bigint AS total FROM notes"
    )
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    let career_count = sqlx::query_as::<_, SingleCount>(
        "SELECT COUNT(*)::bigint AS total FROM careers"
    )
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    let ai_count = sqlx::query_as::<_, SingleCount>(
        "SELECT COUNT(*)::bigint AS total FROM ai_trends"
    )
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    let notif_count = sqlx::query_as::<_, SingleCount>(
        "SELECT COUNT(*) FILTER (WHERE is_new = true)::bigint AS total FROM notifications"
    )
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    let upcoming_exams = sqlx::query_as::<_, ExamDeadline>(
        "SELECT name, application_end_date AS deadline FROM exams WHERE status IN ('upcoming','open') ORDER BY created_at LIMIT 5"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(internal_error)?;

    let upcoming_jobs = sqlx::query_as::<_, JobDeadline>(
        "SELECT title AS name, application_deadline AS deadline FROM jobs WHERE status = 'open' LIMIT 3"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(internal_error)?;

    let mut upcoming_deadlines: Vec<DeadlineItem> = upcoming_exams
        .into_iter()
        .map(|e| DeadlineItem {
            name: e.name,
            deadline: e.deadline.unwrap_or_else(|| "TBD".to_string()),
            item_type: "exam".to_string(),
        })
        .collect();

    upcoming_deadlines.extend(upcoming_jobs.into_iter().map(|j| DeadlineItem {
        name: j.name,
        deadline: j.deadline.unwrap_or_else(|| "TBD".to_string()),
        item_type: "job".to_string(),
    }));

    Ok(Json(DashboardSummary {
        total_exams: exam_counts.total,
        open_exams: exam_counts.open,
        total_jobs: job_counts.total,
        open_jobs: job_counts.open,
        total_notes: note_count.total,
        total_careers: career_count.total,
        upcoming_deadlines,
        latest_notifications: notif_count.total,
        ai_trends: ai_count.total,
    }))
}

pub fn routes() -> Vec<Route> {
    routes![get_dashboard]
}
