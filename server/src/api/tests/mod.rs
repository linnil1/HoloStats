mod channels_list;
mod streams_report;
mod utils;
mod xml;

use sqlx::PgPool;
use warp::test::request;
use warp::Filter;

use crate::config::CONFIG;
use crate::reject::handle_rejection;
use crate::v3::api;

use utils::is_not_found;

#[tokio::test]
async fn not_found() {
    let pool = PgPool::connect(&CONFIG.database.url).await.unwrap();

    let api = api(pool).recover(handle_rejection);

    let res = request()
        .method("GET")
        .path("/v3/not_found")
        .reply(&api)
        .await;

    is_not_found(res);
}
