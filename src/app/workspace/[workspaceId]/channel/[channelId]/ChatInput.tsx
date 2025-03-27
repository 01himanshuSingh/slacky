import dynamic from 'next/dynamic'
const Editor = dynamic(()=>import('@/components/Editor'), {ssr:false})
import React from 'react'

interface ChatInputProps{
  placeholder:string
}

export default function ChatInput({placeholder}:ChatInputProps) {
  return (
    <div
    className=' px-4 w-full' >
        <Editor 
        placeholder={placeholder}
        onSubmit={()=>{}}
        disabled={false}

        />
    </div>
  )
}
