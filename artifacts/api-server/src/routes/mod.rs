pub mod aitrends;
pub mod careers;
pub mod dashboard;
pub mod exams;
pub mod jobs;
pub mod notes;
pub mod notifications;
pub mod profile;

pub fn all_routes() -> Vec<rocket::Route> {
    let mut routes = vec![];
    routes.extend(exams::routes());
    routes.extend(jobs::routes());
    routes.extend(notes::routes());
    routes.extend(careers::routes());
    routes.extend(profile::routes());
    routes.extend(aitrends::routes());
    routes.extend(notifications::routes());
    routes.extend(dashboard::routes());
    routes
}
