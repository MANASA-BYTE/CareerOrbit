#[macro_use]
extern crate rocket;

mod errors;
mod models;
mod routes;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{options, Request, Response, Route};
use sqlx::PgPool;

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "CORS Headers",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS",
        ));
        response.set_header(Header::new(
            "Access-Control-Allow-Headers",
            "Content-Type, Accept, Authorization",
        ));
    }
}

#[options("/<_..>")]
fn preflight() -> rocket::http::Status {
    rocket::http::Status::Ok
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL database");

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080);

    let figment = rocket::Config::figment()
        .merge(("port", port))
        .merge(("address", "0.0.0.0"))
        .merge(("log_level", "normal"));

    let mut all_routes: Vec<Route> = routes::all_routes();
    all_routes.extend(routes![preflight]);

    rocket::custom(figment)
        .manage(pool)
        .attach(Cors)
        .mount("/api", all_routes)
        .launch()
        .await?;

    Ok(())
}
