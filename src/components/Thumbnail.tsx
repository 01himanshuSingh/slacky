import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { XIcon } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ThumbnailProps {
  url?: string;
}

function Thumbnail({ url }: ThumbnailProps) {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in'>
          <img
            src={url}
            alt="Thumbnail"
            className='w-full h-full object-cover'
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <DialogHeader>
          <DialogTitle>
            <VisuallyHidden>Image Preview</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        <img src={url} alt="Preview" />
      </DialogContent>
    </Dialog>
  );
}

export default Thumbnail;
