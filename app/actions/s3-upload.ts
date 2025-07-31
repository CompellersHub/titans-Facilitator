"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  S3_CONFIG,
  validateFile,
  type S3UploadResult,
  type S3FolderType,
} from "@/lib/s3-config";

// Initialize S3 client
const s3Client = new S3Client({
  region: S3_CONFIG.region,
  credentials: {
    accessKeyId: S3_CONFIG.accessKeyId,
    secretAccessKey: S3_CONFIG.secretAccessKey,
  },
});

// Server action to upload file to S3
export async function uploadFileToS3(
  formData: FormData,
  folder: S3FolderType
): Promise<S3UploadResult> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine content type
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
      Metadata: {
        "original-name": file.name,
        "upload-timestamp": new Date().toISOString(),
      },
    });

    // Execute the upload
    await s3Client.send(command);

    // Return the public URL
    const publicUrl = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
    console.log(`File uploaded successfully: ${publicUrl}`);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("S3 Upload Error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("AccessDenied")) {
        return {
          success: false,
          error:
            "Access denied. Please check AWS credentials and bucket permissions.",
        };
      } else if (error.message.includes("NoSuchBucket")) {
        return {
          success: false,
          error: `Bucket '${S3_CONFIG.bucket}' does not exist.`,
        };
      } else if (error.message.includes("NetworkError")) {
        return {
          success: false,
          error:
            "Network error. Please check your internet connection and try again.",
        };
      }
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    return {
      success: false,
      error: "An unknown error occurred during upload.",
    };
  }
}

// Server action to delete file from S3
export async function deleteFileFromS3(
  fileUrl: string
): Promise<S3UploadResult> {
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

    return { success: true };
  } catch (error) {
    console.error("S3 Delete Error:", error);
    return {
      success: false,
      error: `Failed to delete file from S3: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
