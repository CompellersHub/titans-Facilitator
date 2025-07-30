/* eslint-disable @typescript-eslint/no-unused-vars */
// AWS S3 Upload utility
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const S3_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIA3LJ4RV54VBU3THAR",
  secretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY ||
    "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",
  region: process.env.AWS_REGION || "eu-north-1",
  bucket: process.env.AWS_S3_BUCKET || "titanscareers",
};

// Initialize S3 client
const s3Client = new S3Client({
  region: S3_CONFIG.region,
  credentials: {
    accessKeyId: S3_CONFIG.accessKeyId,
    secretAccessKey: S3_CONFIG.secretAccessKey,
  },
});

export interface S3UploadOptions {
  file: File;
  folder: string;
  onProgress?: (progress: number) => void;
}

export async function uploadToS3({
  file,
  folder,
  onProgress,
}: S3UploadOptions): Promise<string> {
  // Validate file before upload
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const key = folder ? `${folder}/${fileName}` : fileName;

  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Simulate progress if callback is provided
    if (onProgress) {
      onProgress(0);
    }

    // Determine content type based on file extension if not provided
    let contentType = file.type;
    if (!contentType) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const typeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        mp4: "video/mp4",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
      contentType = typeMap[extension || ""] || "application/octet-stream";
    }

    // Create the upload command
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read", // Make the file publicly readable
      Metadata: {
        "original-name": file.name,
        "upload-timestamp": new Date().toISOString(),
      },
    });

    // Progress simulation during upload
    let progressInterval: NodeJS.Timeout;
    if (onProgress) {
      let currentProgress = 0;
      progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + Math.random() * 15, 85);
        onProgress(currentProgress);
      }, 200);
    }

    // Execute the upload
    const result = await s3Client.send(command);

    // Clear interval and set progress to 100%
    if (onProgress) {
      clearInterval(progressInterval!);
      onProgress(100);
    }

    // Return the public URL
    const publicUrl = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
    console.log(`File uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("AccessDenied")) {
        throw new Error(
          "Access denied. Please check your AWS credentials and bucket permissions."
        );
      } else if (error.message.includes("NoSuchBucket")) {
        throw new Error(`Bucket '${S3_CONFIG.bucket}' does not exist.`);
      } else if (error.message.includes("NetworkError")) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }
      throw new Error(`Upload failed: ${error.message}`);
    }

    throw new Error("An unknown error occurred during upload.");
  }
}

// Function to delete a file from S3
export async function deleteFromS3(fileUrl: string): Promise<boolean> {
  try {
    // Extract the key from the URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`File deleted successfully: ${key}`);
    return true;
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error(
      `Failed to delete file from S3: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Function to get a public URL for a file
export function getS3PublicUrl(key: string): string {
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
}

// Function to extract key from S3 URL
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

export const S3_FOLDERS = {
  VIDEOS: "videos",
  COURSE_IMAGES: "course_images",
  COURSE_NOTES: "course_notes",
  TEACHER_PROFILE: "teacher_profile",
  ASSIGNMENTS: "assignments",
  SUBMISSIONS: "submissions",
  THUMBNAILS: "thumbnails",
  DOCUMENTS: "documents",
} as const;
