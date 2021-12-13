const API_URL=process.env.REACT_APP_API_URL

export const USER_API = {
  LOGIN: API_URL + "/api/api-token-auth/",
}

export const S3_API = {
  GET_ALL_S3_BUCKET: API_URL + "/api/s3-bucket/",
  S3_CREATE_BUCKET: API_URL + "/api/s3-bucket/",
  GET_FOLDER_BY_BUCKET_ID: API_URL + "/api/get-folder-by-bucket-id/",
  CREATE_FOLDER: API_URL + "/api/s3-folder/",
}

export const SELF_URL = {
  LOGIN: "/sign-in",
  DASHBOARD: "/dashboard",
  BUCKET_MANAGEMENT: "/bucket-management",
  FOLDER_MANAGEMENT: "/folder-management"
}
