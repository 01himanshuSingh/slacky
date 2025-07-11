import Quill from "quill";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Delta, QuillOptionsStatic } from "quill";
import { PiTextAa } from "react-icons/pi";
import "quill/dist/quill.snow.css"; // Ensure this path is correct
import { Button } from "./ui/button";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { MdSend } from "react-icons/md";
import Hint from "./Hint";
import { list } from "postcss";
import { Emojipoper } from "./EmojiProper";
import Image from "next/image";

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCanel: () => void;
  placeholder?: string;
  defaultValue?: Delta;
  disabled: boolean;
}

type EditorValue = {
  image: any;
  body: string;
};

export default function Editor({
  variant = "create",
  onCanel,
  onSubmit,
  placeholder = "Write something...",
  defaultValue = {} as Delta,
  disabled = false,
}: EditorProps) {
const [image, setImage] = useState<File|null>(null)
  const [isToolbarVisible, setToolbarVisible] = useState(false)
  const [text, setText] = useState(""); // State to store text content
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quilRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disableRef = useRef(disabled);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElement =  useRef<HTMLInputElement>(null)
 

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disableRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Create an inner div for Quill
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    // Quill options with fixed keyboard bindings
    const options: QuillOptionsStatic = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar:[
          ['bold', 'italic','strike'],
          ['link'],
          [{list:'ordered'},{list:'bullet'}]
        ],
        keyboard: { // ✅ Use lowercase "keyboard"
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                handleSend(); // Call send function on Enter press
               // Prevents default new line behavior
              },
            },
          },
        },
      },
    };

    // Initialize Quill
    const quill = new Quill(editorContainer, options);
    quilRef.current = quill;
    quilRef.current.focus();

    // Ensure the default value is a valid Delta object
    if (
      defaultValueRef.current &&
      typeof defaultValueRef.current === "object" &&
      "ops" in defaultValueRef.current
    ) {
      quill.setContents(defaultValueRef.current);
    }

    // Update text state on user input
    quill.on("text-change", () => {
      setText(quill.getText().trim());
    });

    return () => {
      container.innerHTML = ""; // Clean up on unmount
    };
  }, []);

  // Function to handle submit
  const handleSend = () => {
    console.log("Textxx:", text); // ✅ Print text value in console
    submitRef.current({ image, body: text }); // ✅ Send text to onSubmit
  };

  const toggleToolbar = ()=>{
    setToolbarVisible((current)=>!current)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')
    if(toolbarElement){
      toolbarElement.classList.toggle('hidden')
    }
  }

  const onEmojiselect = (emoji:any)=>{
    const quill = quilRef.current
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
}

  return (
    <div className="flex flex-col px-4">
      <input type="file" accept="image/*" 
      ref={imageElement}
      onChange={(event)=>{setImage(event.target.files![0])}}
      className="hidden"
      />
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-500 focus-within:shadow-sm transition bg-white p-2">
        <div ref={containerRef} className="h-full" />
        {
          !!image && (
            <div className="p-2">
                  <div className="relative size-[62px] flex items-center justify-center group">
                 <Hint label="remove">
                  <button
                  onClick={()=>{
                    setImage(null)
                    imageElement.current!.value= ''
                  }}
                 
  className="items-end top-[-2px] rounded-xl  absolute right-[-17px] size-6 z-[4] border-2 border-white"

                  ><XIcon/></button></Hint>
                 <Image src={URL.createObjectURL(image)}
                  alt="Upload"
                  fill
                    className=" rounded-xl overflow-hidden border object-cover"
                  />
                  </div>
            </div>
          )
        }
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label="Hide formatting">
            <Button disabled={disabled} size="iconsm" variant="ghost" 
            onClick={toggleToolbar}>
              <PiTextAa />
            </Button>
          </Hint>
          <Emojipoper onEmojiSelect={onEmojiselect}>
            <Button disabled={disabled} size="iconsm" variant="ghost">
              <Smile />
            </Button>
            </Emojipoper>
          {variant === "create" && (
            <Hint label="Photos">
              <Button disabled={disabled} size="iconsm" variant="ghost" onClick={() => imageElement.current?.click()}>
                <ImageIcon />
              </Button>
            </Hint>
          )}

          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="default" size="sm" onClick={onCanel} disabled={disabled}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={disabled}
                onClick={()=>{onSubmit({body:JSON.stringify(quilRef.current?.getContents()),
                  image
                })}}

                className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white pb-2"
              >
                Save
              </Button>
            </div>
          )}

          {variant === "create" && (
            <Hint label="Send">
              <Button
                size="iconsm"
                className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white pb-2"
                disabled={false}
                onClick={()=>{onSubmit({body:JSON.stringify(quilRef.current?.getContents()),
                  image
                })}}
              >
                <MdSend className="size-4" />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      {
        variant === 'create'&& (

          <div className="p-2 text-[10px] text-muted-foreground flex justify-end"> 
          <p>
            <strong>Shift + Return </strong>
          </p>
        </div>
        )
      }
      
    </div>
  );
}
