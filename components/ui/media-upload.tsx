import React from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, Eye, Play, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UploadState } from "@/hooks/use-s3-upload";

interface MediaUploadProps {
  label: string;
  fieldKey: string;
  accept: string;
  currentUrl?: string | null;
  uploadState: UploadState;
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  onRemove: () => void;
  placeholder?: string;
  className?: string;
}

export function MediaUpload({
  label,
  fieldKey,
  accept,
  currentUrl,
  uploadState,
  onFileSelect,
  onCancel,
  onRemove,
  placeholder = "Click to upload file",
  className = "",
}: MediaUploadProps) {
  const isImage = accept.includes("image");
  const isVideo = accept.includes("video");
  const hasFile = !!(currentUrl || uploadState.url);

  const renderPreview = () => {
    const url = uploadState.url || currentUrl;
    if (!url) return null;

    return (
      <div className="mt-4 relative group">
        {isImage && (
          <div className="relative">
            <Image
              src={url}
              alt="Preview"
              width={300}
              height={128}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(url, "_blank")}
                className="mr-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="destructive" size="sm" onClick={onRemove}>
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        )}

        {isVideo && (
          <div className="relative">
            <video
              src={url}
              className="w-full h-32 object-cover rounded-lg border"
              controls={false}
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(url, "_blank")}
                className="mr-2"
              >
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Button variant="destructive" size="sm" onClick={onRemove}>
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
              Video
            </div>
          </div>
        )}

        {!isImage && !isVideo && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {uploadState.fileName || "Uploaded file"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(url, "_blank")}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="destructive" size="sm" onClick={onRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUploadArea = () => (
    <div
      className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center ${className}`}
    >
      <Input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
        className="hidden"
        id={fieldKey}
        disabled={uploadState.isUploading}
      />

      {!uploadState.isUploading && !hasFile && (
        <Label htmlFor={fieldKey} className="cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        </Label>
      )}

      {uploadState.isUploading && (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm">Uploading {uploadState.fileName}...</span>
          </div>
          <Progress value={uploadState.progress} className="w-full" />
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="mt-2"
          >
            Cancel Upload
          </Button>
        </div>
      )}

      {uploadState.error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription className="text-xs">
            {uploadState.error}
          </AlertDescription>
        </Alert>
      )}

      {hasFile && !uploadState.isUploading && (
        <div className="space-y-3">
          <div className="flex items-center justify-center text-green-600">
            <span className="text-sm font-medium">
              ✓ {uploadState.fileName || "File uploaded successfully"}
            </span>
          </div>
          <div className="flex gap-2 justify-center">
            <Label htmlFor={fieldKey}>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Update
                </span>
              </Button>
            </Label>
            <Button variant="destructive" size="sm" onClick={onRemove}>
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {renderUploadArea()}
      {renderPreview()}
    </div>
  );
}
