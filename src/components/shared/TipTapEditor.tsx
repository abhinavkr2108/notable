"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import useDebounce from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/database/schema";
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";

interface EditorProps {
  note: NoteType;
}
export default function TipTapEditor({ note }: EditorProps) {
  const [editorState, setEditorState] = useState(note.editorState || "");
  const [isSaving, setIsSaving] = useState(false);
  const debouncedState = useDebounce(editorState, 1000);

  const { complete, completion } = useCompletion({
    api: "/api/completion",
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

  const lastCompletion = useRef("");

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Ctrl-Shift-a": () => {
          const prompt = this.editor.getText().split(" ").splice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!completion || !editor) {
      return;
    }
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;

    editor.commands.insertContent(diff || "");
  }, [completion, editor]);

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
