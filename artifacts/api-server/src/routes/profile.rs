use rocket::serde::json::Json;
use rocket::{get, post, put, routes, Route, State};
use rocket::form::FromForm;
use sqlx::PgPool;
use crate::errors::{internal_error, not_found_error, conflict_error, ApiResult};
use crate::models::{Student, CreateProfileBody, UpdateProfileBody};

const STUDENT_SELECT: &str = r#"
    SELECT id, apar_id, name, email, phone, education_level, current_class,
        school, state, district,
        COALESCE(career_interests, ARRAY[]::text[]) AS career_interests,
        COALESCE(target_exams, ARRAY[]::text[]) AS target_exams,
        avatar_url, created_at, updated_at
    FROM students
"#;

#[derive(FromForm)]
pub struct ProfileQuery {
    #[field(name = "aparId")]
    apar_id: Option<String>,
}

#[get("/profile?<q..>")]
pub async fn get_profile(pool: &State<PgPool>, q: ProfileQuery) -> ApiResult<Student> {
    let apar_id = q.apar_id.ok_or_else(|| {
        (
            rocket::http::Status::BadRequest,
            rocket::serde::json::Json(crate::errors::ApiError {
                error: "invalid_params".to_string(),
                message: "aparId is required".to_string(),
            }),
        )
    })?;
    let sql = format!("{} WHERE apar_id = $1", STUDENT_SELECT);
    let student = sqlx::query_as::<_, Student>(&sql)
        .bind(&apar_id)
        .fetch_optional(pool.inner())
        .await
        .map_err(internal_error)?
        .ok_or_else(|| not_found_error("Profile not found"))?;
    Ok(Json(student))
}

#[post("/profile", data = "<body>")]
pub async fn create_profile(pool: &State<PgPool>, body: Json<CreateProfileBody>) -> ApiResult<Student> {
    #[derive(sqlx::FromRow)]
    struct IdRow { id: i32 }

    let existing = sqlx::query_as::<_, IdRow>("SELECT id FROM students WHERE apar_id = $1")
        .bind(&body.apar_id)
        .fetch_optional(pool.inner())
        .await
        .map_err(internal_error)?;

    if existing.is_some() {
        return Err(conflict_error("Profile with this APAAR ID already exists"));
    }

    let career_interests: Vec<String> = body.career_interests.clone().unwrap_or_default();
    let target_exams: Vec<String> = body.target_exams.clone().unwrap_or_default();

    let student = sqlx::query_as::<_, Student>(
        r#"INSERT INTO students (apar_id, name, email, phone, education_level, current_class, school, state, district, career_interests, target_exams)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, apar_id, name, email, phone, education_level, current_class,
               school, state, district,
               COALESCE(career_interests, ARRAY[]::text[]) AS career_interests,
               COALESCE(target_exams, ARRAY[]::text[]) AS target_exams,
               avatar_url, created_at, updated_at"#,
    )
    .bind(&body.apar_id)
    .bind(&body.name)
    .bind(&body.email)
    .bind(&body.phone)
    .bind(&body.education_level)
    .bind(&body.current_class)
    .bind(&body.school)
    .bind(&body.state)
    .bind(&body.district)
    .bind(&career_interests)
    .bind(&target_exams)
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;

    Ok(Json(student))
}

#[put("/profile/<id>", data = "<body>")]
pub async fn update_profile(pool: &State<PgPool>, id: i32, body: Json<UpdateProfileBody>) -> ApiResult<Student> {
    let student = sqlx::query_as::<_, Student>(
        r#"UPDATE students SET
               name = COALESCE($2, name),
               email = COALESCE($3, email),
               phone = COALESCE($4, phone),
               education_level = COALESCE($5, education_level),
               current_class = COALESCE($6, current_class),
               school = COALESCE($7, school),
               state = COALESCE($8, state),
               district = COALESCE($9, district),
               career_interests = COALESCE($10, career_interests),
               target_exams = COALESCE($11, target_exams),
               updated_at = NOW()
           WHERE id = $1
           RETURNING id, apar_id, name, email, phone, education_level, current_class,
               school, state, district,
               COALESCE(career_interests, ARRAY[]::text[]) AS career_interests,
               COALESCE(target_exams, ARRAY[]::text[]) AS target_exams,
               avatar_url, created_at, updated_at"#,
    )
    .bind(id)
    .bind(&body.name)
    .bind(&body.email)
    .bind(&body.phone)
    .bind(&body.education_level)
    .bind(&body.current_class)
    .bind(&body.school)
    .bind(&body.state)
    .bind(&body.district)
    .bind(&body.career_interests)
    .bind(&body.target_exams)
    .fetch_optional(pool.inner())
    .await
    .map_err(internal_error)?
    .ok_or_else(|| not_found_error("Profile not found"))?;

    Ok(Json(student))
}

pub fn routes() -> Vec<Route> {
    routes![get_profile, create_profile, update_profile]
}
