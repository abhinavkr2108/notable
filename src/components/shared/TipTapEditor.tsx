"use client";
import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

export default function TipTapEditor() {
  const [editorState, setEditorState] = useState("");
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  //   if (!editor) {
  //     return redirect("/dashboard");
  //   }
  return (
    <div>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}

        <Button>Saved</Button>
      </div>
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
