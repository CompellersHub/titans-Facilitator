"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteAssignment } from "@/hooks/use-assignments";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteAssignmentButton({ assignmentId, buttonClassName }: { assignmentId: string; buttonClassName?: string }) {
  const { mutate: deleteAssignment, status } = useDeleteAssignment();
  const isLoading = status === "pending";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete Assignment"
      description="Are you sure you want to delete this assignment? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      loading={isLoading}
      onConfirm={() => {
        deleteAssignment(assignmentId, {
          onSuccess: () => {
            setOpen(false);
            router.push("/assignments");
          },
          onError: () => {
            setOpen(false);
            alert("Failed to delete assignment. Please try again.");
          },
        });
      }}
      trigger={
        <Button
          variant="outline"
          className={`text-destructive bg-transparent shadow-none ${buttonClassName ?? ''}`}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      }
    />
  );
}
