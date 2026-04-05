use rocket::http::Status;
use rocket::serde::json::Json;
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiError {
    pub error: String,
    pub message: String,
}

pub type ApiResult<T> = Result<Json<T>, (Status, Json<ApiError>)>;

pub fn internal_error(e: impl std::fmt::Display) -> (Status, Json<ApiError>) {
    (
        Status::InternalServerError,
        Json(ApiError {
            error: "internal_error".to_string(),
            message: e.to_string(),
        }),
    )
}

pub fn not_found_error(msg: &str) -> (Status, Json<ApiError>) {
    (
        Status::NotFound,
        Json(ApiError {
            error: "not_found".to_string(),
            message: msg.to_string(),
        }),
    )
}

pub fn conflict_error(msg: &str) -> (Status, Json<ApiError>) {
    (
        Status::Conflict,
        Json(ApiError {
            error: "conflict".to_string(),
            message: msg.to_string(),
        }),
    )
}
