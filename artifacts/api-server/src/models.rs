use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Exam {
    pub id: i32,
    pub name: String,
    pub full_name: Option<String>,
    pub category: String,
    pub education_level: Option<String>,
    pub conducting_body: Option<String>,
    pub application_start_date: Option<String>,
    pub application_end_date: Option<String>,
    pub exam_date: Option<String>,
    pub result_date: Option<String>,
    pub application_fee: Option<String>,
    pub official_website: Option<String>,
    pub logo_url: Option<String>,
    pub total_vacancies: Option<i32>,
    pub state: Option<String>,
    pub is_national: Option<bool>,
    pub is_urgent: Option<bool>,
    pub status: String,
    pub description: Option<String>,
    pub eligibility: Option<String>,
    pub syllabus: Option<String>,
    pub syllabus_url: Option<String>,
    pub application_procedure: Option<String>,
    pub required_documents: Vec<String>,
    pub exam_pattern: Option<String>,
    pub previous_year_papers: Vec<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Job {
    pub id: i32,
    pub title: String,
    pub organization: String,
    pub sector: String,
    pub category: Option<String>,
    pub location: Option<String>,
    pub state: Option<String>,
    pub education_level: Option<String>,
    pub vacancies: Option<i32>,
    pub salary_min: Option<f32>,
    pub salary_max: Option<f32>,
    pub salary_text: Option<String>,
    pub application_deadline: Option<String>,
    pub application_url: Option<String>,
    pub logo_url: Option<String>,
    pub is_trending: Option<bool>,
    pub is_urgent: Option<bool>,
    pub status: String,
    pub description: Option<String>,
    pub eligibility: Option<String>,
    pub tags: Vec<String>,
    pub posted_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: i32,
    pub title: String,
    pub subject: String,
    pub folder: String,
    pub education_level: Option<String>,
    pub description: Option<String>,
    pub file_url: Option<String>,
    pub file_type: Option<String>,
    pub uploaded_by: Option<String>,
    pub downloads: Option<i32>,
    pub rating: Option<f32>,
    pub tags: Vec<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CreateNoteBody {
    pub title: String,
    pub subject: String,
    pub folder: String,
    pub education_level: Option<String>,
    pub description: Option<String>,
    pub file_url: Option<String>,
    pub file_type: Option<String>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Career {
    pub id: i32,
    pub title: String,
    pub domain: String,
    pub description: Option<String>,
    pub education_required: Option<String>,
    pub average_salary: Option<String>,
    pub growth_rate: Option<String>,
    pub job_demand: String,
    pub skills: Vec<String>,
    pub top_companies: Vec<String>,
    pub related_exams: Vec<String>,
    pub roadmap: Vec<String>,
    pub icon_url: Option<String>,
    pub is_trending: Option<bool>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AiTrend {
    pub id: i32,
    pub title: String,
    pub category: String,
    pub description: Option<String>,
    pub impact: String,
    pub readiness_year: Option<i32>,
    pub skills: Vec<String>,
    pub careers: Vec<String>,
    pub icon_url: Option<String>,
    pub is_boom: Option<bool>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Notification {
    pub id: i32,
    pub exam_name: String,
    #[serde(rename = "type")]
    pub notification_type: String,
    pub title: String,
    pub date: Option<String>,
    pub link: Option<String>,
    pub is_new: Option<bool>,
    pub is_urgent: Option<bool>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Student {
    pub id: i32,
    pub apar_id: String,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub education_level: String,
    pub current_class: Option<String>,
    pub school: Option<String>,
    pub state: Option<String>,
    pub district: Option<String>,
    pub career_interests: Vec<String>,
    pub target_exams: Vec<String>,
    pub avatar_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CreateProfileBody {
    pub apar_id: String,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub education_level: String,
    pub current_class: Option<String>,
    pub school: Option<String>,
    pub state: Option<String>,
    pub district: Option<String>,
    pub career_interests: Option<Vec<String>>,
    pub target_exams: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProfileBody {
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub education_level: Option<String>,
    pub current_class: Option<String>,
    pub school: Option<String>,
    pub state: Option<String>,
    pub district: Option<String>,
    pub career_interests: Option<Vec<String>>,
    pub target_exams: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatBody {
    pub message: String,
    pub context: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChatResponse {
    pub reply: String,
    pub suggestions: Vec<String>,
    pub related_exams: Vec<String>,
    pub related_careers: Vec<String>,
}

#[derive(Debug, Serialize, Clone)]
pub struct NoteFolder {
    pub folder: String,
    pub label: String,
    pub icon: String,
    pub count: i64,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DashboardSummary {
    pub total_exams: i64,
    pub open_exams: i64,
    pub total_jobs: i64,
    pub open_jobs: i64,
    pub total_notes: i64,
    pub total_careers: i64,
    pub upcoming_deadlines: Vec<DeadlineItem>,
    pub latest_notifications: i64,
    pub ai_trends: i64,
}

#[derive(Debug, Serialize, Clone)]
pub struct DeadlineItem {
    pub name: String,
    pub deadline: String,
    #[serde(rename = "type")]
    pub item_type: String,
}
