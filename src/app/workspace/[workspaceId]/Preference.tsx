"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useWorkspaceId } from "@/hook/useWorkspaceid";
import { toast } from "sonner";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateworkspace";
import { useRouter } from "next/navigation";
import { useRemoveWorkspace } from "@/features/workspaces/api/useRemoveWorkspaces";

interface PreferenceProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

function Preference({ open, setOpen, initialValue }: PreferenceProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(initialValue);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setValue(initialValue); // Sync state when initialValue changes
  }, [initialValue]);

  // 🔹 Handle Workspace Rename
  const handleEdit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update workspace.");
        },
      }
    );
  };

  // 🔹 Handle Workspace Deletion
  const handleRemove = () => {
    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Workspace removed successfully!");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to remove workspace.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        {/* 🔹 Header */}
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 flex flex-col gap-y-2">
          {/* 🔹 Edit Workspace Name */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Workspace Name</p>
                  <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                </div>
                <p className="text-sm">{value}</p>
              </div>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Workspace</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleEdit}>
                <Input
                  value={value}
                  disabled={isUpdatingWorkspace}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={70}
                  placeholder="Workspace name e.g. Work, Personal, Home"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button disabled={isUpdatingWorkspace}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isUpdatingWorkspace}>
                    {isUpdatingWorkspace ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 🔹 Delete Workspace Button */}
        <Button
          disabled={isRemovingWorkspace}
          onClick={handleRemove} // ✅ Fixed function call
          className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
        >
          <TrashIcon className="size-4" />
          <p className="text-sm font-semibold">
            {isRemovingWorkspace ? "Deleting..." : "Delete Workspace"}
          </p>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default Preference;
