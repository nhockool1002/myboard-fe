const API_URL=process.env.REACT_APP_API_URL

export const USER_API = {
  LOGIN: API_URL + "/api/api-token-auth/",
}

export const S3_API = {
  GET_ALL_S3_BUCKET: API_URL + "/api/s3-bucket/",
  S3_CREATE_BUCKET: API_URL + "/api/s3-bucket/",
  GET_FOLDER_BY_BUCKET_ID: API_URL + "/api/get-folder-by-bucket-id/",
  CREATE_FOLDER: API_URL + "/api/s3-folder/",
  UPLOAD_IMAGES: API_URL + "/api/s3-upload-multiple/",
  GET_IMAGE_BY_FOLDER: API_URL + "/api/s3-object-by-folder/",
  DELETE_FILE_BY_ID: API_URL + "/api/s3-file/",
  DELETE_FOLDER: API_URL + "/api/s3-folder/",
  DELETE_BUCKET: API_URL + "/api/s3-bucket/",
  PUBLIC_ACCESS_BUCKET: API_URL + "/api/set-s3-public-access/",
}

export const SETTING_API = {
  GET_GENERAL_SETTINGS: API_URL + "/api/settings/",
  UPDADTE_GENERAL_SETTINGS: API_URL + "/api/settings/",
  UPDADTE_THUMB_SETTINGS: API_URL + "/api/settings/update-thumb"
}

export const NOTE_API = {
  GET_NOTES: API_URL + "/api/notes/",
  CREATE_NOTES: API_URL + "/api/notes/",
  UPDATE_NOTES: API_URL + "/api/update-notes/",
  DELETE_NOTES: API_URL + "/api/notes/",
}

export const MONEY_EXCHANGE = {
  GET_EXCHANGE: API_URL + "/api/money-exchange/",
  GET_RATES_HISTORICAL: API_URL + "/api/historical-exchange/",
}

export const EX_CATEGORIES = {
  REST: API_URL + "/api/ex-categories/",
}

export const EX_LABELS = {
  REST: API_URL + "/api/ex-labels/",
}

export const SELF_URL = {
  LOGIN: "/sign-in",
  DASHBOARD: "/dashboard",
  BUCKET_MANAGEMENT: "/bucket-management",
  FOLDER_MANAGEMENT: "/folder-management",
  UPLOAD_PICTURE: "/upload-pictures",
  PHOTO_DETAIL: "/photo-details",
  PHOTO_SETTINGS: "/photo-settings",
  GENERAL_SETTINGS: "/general-settings",
  MONEY_EXCHANGE: "/money-exchange",
  NOTES: "/notes",
  PHOTO: "/photo",
  CATEGORIES: "/categories",
  LABELS: "/labels"
}
