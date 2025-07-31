// S3 Configuration and Types
// This file contains non-function exports that can't be in server action files

export interface S3UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// S3 folder mappings based on your Django storage classes
export const S3_FOLDERS = {
  VIDEOS: "videos",
  COURSE_IMAGES: "media", // PublicMediaStorage
  COURSE_NOTES: "course_notes",
  TEACHER_PROFILE: "Teacher_profile",
  ASSIGNMENTS: "assignments",
  SUBMISSIONS: "submissions",
  THUMBNAILS: "thumbnails",
  DOCUMENTS: "documents",
  BLOGS: "blogs",
  USERS: "users",
  PROFILE_PICTURES: "profile_pictures",
  PRIVATE: "private",
} as const;

export type S3FolderType = (typeof S3_FOLDERS)[keyof typeof S3_FOLDERS];

// S3 Configuration
export const S3_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || "eu-north-1",
  bucket: process.env.AWS_S3_BUCKET || "titanscareers",
};

// Utility functions (non-server actions)
export function getS3PublicUrl(key: string): string {
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
}

export function extractS3Key(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  } catch {
    throw new Error("Invalid S3 URL provided");
  }
}

// Function to validate file before upload
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of 100MB. Current size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  // Check file type
  const allowedTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Please upload images, videos, or documents.`,
    };
  }

  return { isValid: true };
}
