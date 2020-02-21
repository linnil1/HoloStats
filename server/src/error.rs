use reqwest::Error as HttpError;
use serde_json::Error as JsonError;
use sqlx::Error as SqlError;
use std::convert::From;
use std::str::Utf8Error;
use url::ParseError as UrlError;
use warp::reject::Reject;

#[derive(Debug)]
pub enum Error {
    Http(HttpError),
    Json(JsonError),
    Sql(SqlError),
    Url(UrlError),
    Utf8(Utf8Error),
}

impl Reject for Error {}

impl From<SqlError> for Error {
    fn from(err: SqlError) -> Error {
        Error::Sql(err)
    }
}

impl From<HttpError> for Error {
    fn from(err: HttpError) -> Error {
        Error::Http(err)
    }
}

impl From<UrlError> for Error {
    fn from(err: UrlError) -> Error {
        Error::Url(err)
    }
}

impl From<JsonError> for Error {
    fn from(err: JsonError) -> Error {
        Error::Json(err)
    }
}

impl From<Utf8Error> for Error {
    fn from(err: Utf8Error) -> Error {
        Error::Utf8(err)
    }
}

pub type Result<T> = std::result::Result<T, Error>;