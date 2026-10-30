// Base64 JSON must fit below Vercel Functions' 4.5 MB request limit.
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_UPLOAD_BODY_BYTES = 4 * 1024 * 1024 + 4096;
