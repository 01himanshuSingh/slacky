'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useChannelId } from '@/hook/useChannelId'
import { useUpdateChannel } from '@/features/channels/api/useUpdateChannel'
import { toast } from 'sonner'
import { useRemoveChannel } from '@/features/channels/api/useRemoveChannel'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import { userCurrentMember } from '@/features/members/api/userCurrentMember'
interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  
  const [value, setValue] = useState(name);
  const [editOpen, setEditOpen] = useState(false);
  const { data: member } = userCurrentMember({ workspaceId }); // FIXED NAME

  const { mutate: updateChannel, isPending: channelUpdating } = useUpdateChannel();
  const { mutate: removeChannel, isPending: channelRemoving } = useRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  // Ensure only admins can edit
  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') {
      toast.error("❌ Only admins can edit channels!");
      return;
    }
    setEditOpen(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel({ name: value, id: channelId }, {
      onSuccess() {
        toast.success("✅ Channel Updated Successfully");
        setEditOpen(false);
      },
      onError(error) {
        toast.error(`❌ Server error: ${error.message}`);
      }
    });
  };

  const channelDelete = async () => {
    removeChannel({ id: channelId }, {
      onSuccess() {
        toast.success("✅ Channel removed successfully!");
        setEditOpen(false);
        router.push(`/workspace/${workspaceId}`);
      },
      onError(error) {
        toast.error(`❌ Server error: ${error.message}`);
      }
    });
  };

  return (
    <>
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className="truncate"># {name}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {name}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                    </div>
                    <p className="text-sm"># {name}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename channel</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <Input
                      value={value}
                      disabled={channelUpdating}
                      onChange={handleChange}
                      required
                      autoFocus
                      minLength={4}
                      maxLength={80}
                      placeholder="e.g. channel-new-name"
                    />
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline" disabled={channelUpdating}>Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={channelUpdating}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                onClick={() => {
                  if (member?.role !== 'admin') {
                    toast.error("❌ Only admins can delete channels!");
                    return;
                  }
                  channelDelete();
                }}
                disabled={channelRemoving}
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete</p>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
