use rocket::serde::json::Json;
use rocket::{get, routes, Route, State};
use rocket::form::FromForm;
use sqlx::PgPool;
use crate::errors::{internal_error, ApiResult};
use crate::models::Notification;

#[derive(FromForm)]
pub struct NotificationQuery {
    #[field(name = "type")]
    notification_type: Option<String>,
}

#[get("/notifications?<q..>")]
pub async fn list_notifications(pool: &State<PgPool>, q: NotificationQuery) -> ApiResult<Vec<Notification>> {
    let notifications = sqlx::query_as::<_, Notification>(
        r#"SELECT id, exam_name, type AS notification_type, title, date, link, is_new, is_urgent, created_at
           FROM notifications
           WHERE ($1::text IS NULL OR type = $1)
           ORDER BY created_at DESC"#,
    )
    .bind(q.notification_type)
    .fetch_all(pool.inner())
    .await
    .map_err(internal_error)?;
    Ok(Json(notifications))
}

pub fn routes() -> Vec<Route> {
    routes![list_notifications]
}
