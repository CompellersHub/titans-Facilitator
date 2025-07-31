import { useState } from "react";
import { uploadFileToS3, deleteFileFromS3 } from "@/app/actions/s3-upload";
import type { S3FolderType } from "@/lib/s3-config";

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  fileName?: string;
  fileType?: string;
  abortController?: AbortController;
}

export function useS3Upload() {
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>(
    {}
  );

  const uploadFile = async (
    file: File,
    folder: S3FolderType,
    fieldKey: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> => {
    // Create abort controller for cancellation
    const abortController = new AbortController();

    // Initialize upload state
    setUploadStates((prev) => ({
      ...prev,
      [fieldKey]: {
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
        fileName: file.name,
        fileType: file.type,
        abortController,
      },
    }));

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress for better UX
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 15, 85);
        setUploadStates((prev) => ({
          ...prev,
          [fieldKey]: {
            ...prev[fieldKey],
            progress,
          },
        }));
        onProgress?.(progress);
      }, 200);

      // Upload file
      const result = await uploadFileToS3(formData, folder);

      // Clear progress interval
      clearInterval(progressInterval);

      if (result.success && result.url) {
        // Set final success state
        setUploadStates((prev) => ({
          ...prev,
          [fieldKey]: {
            isUploading: false,
            progress: 100,
            error: null,
            url: result.url!,
          },
        }));
        onProgress?.(100);

        // Clear progress after delay
        setTimeout(() => {
          setUploadStates((prev) => ({
            ...prev,
            [fieldKey]: {
              ...prev[fieldKey],
              progress: 0,
            },
          }));
        }, 2000);

        return result.url;
      } else {
        // Set error state
        setUploadStates((prev) => ({
          ...prev,
          [fieldKey]: {
            isUploading: false,
            progress: 0,
            error: result.error || "Upload failed",
            url: null,
          },
        }));
        return null;
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadStates((prev) => ({
        ...prev,
        [fieldKey]: {
          isUploading: false,
          progress: 0,
          error: errorMessage,
          url: null,
        },
      }));
      return null;
    }
  };

  const cancelUpload = (fieldKey: string) => {
    const uploadState = uploadStates[fieldKey];
    if (uploadState?.abortController) {
      uploadState.abortController.abort();
    }

    setUploadStates((prev) => ({
      ...prev,
      [fieldKey]: {
        isUploading: false,
        progress: 0,
        error: null,
        url: null,
      },
    }));
  };

  const removeFile = async (
    fieldKey: string,
    fileUrl?: string
  ): Promise<boolean> => {
    try {
      // Delete from S3 if URL provided
      if (fileUrl) {
        await deleteFileFromS3(fileUrl);
      }

      // Clear upload state
      setUploadStates((prev) => ({
        ...prev,
        [fieldKey]: {
          isUploading: false,
          progress: 0,
          error: null,
          url: null,
        },
      }));

      return true;
    } catch (error) {
      console.error("Remove failed:", error);
      return false;
    }
  };

  const deleteFile = async (fileUrl: string): Promise<boolean> => {
    try {
      const result = await deleteFileFromS3(fileUrl);
      return result.success;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  };

  const clearError = (fieldKey: string) => {
    setUploadStates((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        error: null,
      },
    }));
  };

  const getUploadState = (fieldKey: string): UploadState => {
    return (
      uploadStates[fieldKey] || {
        isUploading: false,
        progress: 0,
        error: null,
        url: null,
      }
    );
  };

  return {
    uploadFile,
    cancelUpload,
    removeFile,
    deleteFile,
    clearError,
    getUploadState,
    uploadStates,
  };
}
