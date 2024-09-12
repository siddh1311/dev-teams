import { useEffect, useRef } from "react";

import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile } from "lucide-react";

import Quill, { QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { Button } from "./ui/button";
import Hint from "./Hint";

const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
    };

    new Quill(editorContainer, options);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label="Hide Formatting">
            <Button
              disabled={false}
              size="iconSm"
              variant={"ghost"}
              onClick={() => {}}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          <Hint label="Emoji">
            <Button
              disabled={false}
              size="iconSm"
              variant={"ghost"}
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>

          <Hint label="Image">
            <Button
              disabled={false}
              size="iconSm"
              variant={"ghost"}
              onClick={() => {}}
            >
              <ImageIcon className="size-4" />
            </Button>
          </Hint>

          <Button
            disabled={false}
            onClick={() => {}}
            size="iconSm"
            className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
          >
            <MdSend className="size-4" />
          </Button>
        </div>
      </div>

      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Enter</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
