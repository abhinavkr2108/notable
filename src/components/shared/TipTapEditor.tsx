"use client";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import useDebounce from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/database/schema";

interface EditorProps {
  note: NoteType;
}
export default function TipTapEditor({ note }: EditorProps) {
  const [editorState, setEditorState] = useState(note.editorState || "");
  const [isSaving, setIsSaving] = useState(false);
  const debouncedState = useDebounce(editorState, 1000);
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/save-note", {
        noteId: note.id,
        editorState: editorState,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (debouncedState === "") {
      return;
    }
    saveNote.mutate(undefined, {
      onSuccess: () => {
        console.log("Saved");
      },
      onError: (e) => {
        console.error(e);
        window.alert("Failed to save note");
      },
    });
  }, [debouncedState]);

  return (
    <div>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}

        <Button variant={"outline"}>
          {saveNote.isPending ? "Saving..." : "Saved"}
        </Button>
      </div>
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
