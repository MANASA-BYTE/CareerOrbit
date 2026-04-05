use rocket::serde::json::Json;
use rocket::{get, post, routes, Route, State};
use rocket::form::FromForm;
use sqlx::PgPool;
use crate::errors::{internal_error, not_found_error, ApiResult};
use crate::models::{Note, CreateNoteBody, NoteFolder};

const NOTE_SELECT: &str = r#"
    SELECT id, title, subject, folder, education_level, description,
        file_url, file_type, uploaded_by, downloads, rating,
        COALESCE(tags, ARRAY[]::text[]) AS tags,
        created_at
    FROM notes
"#;

#[derive(FromForm)]
pub struct NoteQuery {
    folder: Option<String>,
    subject: Option<String>,
    #[field(name = "educationLevel")]
    education_level: Option<String>,
}

#[get("/notes/folders")]
pub async fn get_folders(pool: &State<PgPool>) -> ApiResult<Vec<NoteFolder>> {
    let static_folders = vec![
        ("school_notes", "School Notes", "book-open"),
        ("college_notes", "College Notes", "graduation-cap"),
        ("competitive_notes", "Competitive Notes", "target"),
        ("exam_specific", "Exam Specific", "file-text"),
    ];

    #[derive(sqlx::FromRow)]
    struct FolderCount { folder: String, count: i64 }

    let rows = sqlx::query_as::<_, FolderCount>(
        "SELECT folder, COUNT(*)::bigint AS count FROM notes GROUP BY folder"
    )
    .fetch_all(pool.inner())
    .await
    .map_err(internal_error)?;

    let folders: Vec<NoteFolder> = static_folders
        .iter()
        .map(|(folder, label, icon)| {
            let count = rows
                .iter()
                .find(|r| r.folder == *folder)
                .map(|r| r.count)
                .unwrap_or(0);
            NoteFolder {
                folder: folder.to_string(),
                label: label.to_string(),
                icon: icon.to_string(),
                count,
            }
        })
        .collect();

    Ok(Json(folders))
}

#[get("/notes?<q..>")]
pub async fn list_notes(pool: &State<PgPool>, q: NoteQuery) -> ApiResult<Vec<Note>> {
    let sql = format!(
        r#"{} WHERE ($1::text IS NULL OR folder = $1)
           AND ($2::text IS NULL OR subject ILIKE $2)
           AND ($3::text IS NULL OR education_level = $3)
           ORDER BY created_at"#,
        NOTE_SELECT
    );
    let notes = sqlx::query_as::<_, Note>(&sql)
        .bind(q.folder)
        .bind(q.subject.as_deref().map(|s| format!("%{}%", s)))
        .bind(q.education_level)
        .fetch_all(pool.inner())
        .await
        .map_err(internal_error)?;
    Ok(Json(notes))
}

#[post("/notes", data = "<body>")]
pub async fn create_note(pool: &State<PgPool>, body: Json<CreateNoteBody>) -> ApiResult<Note> {
    let tags: Vec<String> = body.tags.clone().unwrap_or_default();
    let note = sqlx::query_as::<_, Note>(
        r#"INSERT INTO notes (title, subject, folder, education_level, description, file_url, file_type, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, title, subject, folder, education_level, description,
               file_url, file_type, uploaded_by, downloads, rating,
               COALESCE(tags, ARRAY[]::text[]) AS tags, created_at"#,
    )
    .bind(&body.title)
    .bind(&body.subject)
    .bind(&body.folder)
    .bind(&body.education_level)
    .bind(&body.description)
    .bind(&body.file_url)
    .bind(&body.file_type)
    .bind(&tags)
    .fetch_one(pool.inner())
    .await
    .map_err(internal_error)?;
    Ok(Json(note))
}

#[get("/notes/<id>")]
pub async fn get_note(pool: &State<PgPool>, id: i32) -> ApiResult<Note> {
    let sql = format!("{} WHERE id = $1", NOTE_SELECT);
    let note = sqlx::query_as::<_, Note>(&sql)
        .bind(id)
        .fetch_optional(pool.inner())
        .await
        .map_err(internal_error)?
        .ok_or_else(|| not_found_error("Note not found"))?;
    Ok(Json(note))
}

pub fn routes() -> Vec<Route> {
    routes![get_folders, list_notes, create_note, get_note]
}
