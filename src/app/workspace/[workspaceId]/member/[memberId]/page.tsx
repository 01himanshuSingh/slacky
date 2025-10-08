'use client'
import { usecreateorgetConversation } from '@/features/conversation/api/useCreateorGet';
import { useMemberId } from '@/hook/useMemberId';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { AlertCircle, Loader } from 'lucide-react';
import React, { useEffect } from 'react'
import { toast } from 'sonner';
import Conversation from './Conversation';

function MemberIdPage() {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { data: conversationId, isPending, mutate } = usecreateorgetConversation();

  useEffect(() => {
    if (memberId && workspaceId) {
      mutate(
        { workspaceId, memberId },
        {
          onError(error) {
            toast.error('Failed to fetch conversation');
          },
        }
      )
    }
  }, [memberId, workspaceId, mutate])

  if (isPending) {
    return (
      <div className='flex justify-center items-center h-full w-full'>
        <Loader className='animate-spin size-4' />
      </div>
    )
  }

  if (!conversationId) {
    return (
      <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
        <AlertCircle className='size-6 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>
          Conversation not found
        </span>
      </div>
    )
  }

  return (
    <div>
      <Conversation id={conversationId} />
    </div>
  )
}

export default MemberIdPage
