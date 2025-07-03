// AWS S3 Upload utility
const S3_CONFIG = {
    accessKeyId: "AKIA3LJ4RV54VBU3THAR",
    secretAccessKey: "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",
    region: "eu-north-1",
    bucket: "titanscareers",
  }
  
  export interface S3UploadOptions {
    file: File
    folder: string
    onProgress?: (progress: number) => void
  }
  
  export async function uploadToS3({ file, folder, onProgress }: S3UploadOptions): Promise<string> {
    const formData = new FormData()
    const fileName = `${Date.now()}-${file.name}`
    const key = folder ? `${folder}/${fileName}` : fileName
  
    // For now, we'll use a direct upload approach
    // In production, you'd want to use signed URLs or a backend endpoint
    try {
      // Simulate upload progress
      if (onProgress) {
        const interval = setInterval(() => {
          const progress = Math.min(Math.random() * 100, 95)
          onProgress(progress)
        }, 100)
  
        setTimeout(() => {
          clearInterval(interval)
          onProgress(100)
        }, 2000)
      }
  
      // For demo purposes, return a mock S3 URL
      // In production, implement actual S3 upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return `https://titanscareers.s3.eu-north-1.amazonaws.com/${key}`
    } catch (error) {
      throw new Error("Failed to upload file to S3")
    }
  }
  
  export const S3_FOLDERS = {
    VIDEOS: "videos",
    COURSE_IMAGES: "",
    COURSE_NOTES: "course_notes",
    TEACHER_PROFILE: "Teacher_profile",
    ASSIGNMENTS: "assignments",
    SUBMISSIONS: "submissions",
  } as const
  