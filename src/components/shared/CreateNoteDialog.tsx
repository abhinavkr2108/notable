"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateNoteDialog() {
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post("/api/upload", {
        noteId: noteId,
      });
      return response.data;
    },
  });

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/new-note", { name: input });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "" || input == undefined || input == null) {
      window.alert("Please enter a name");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ noteId }) => {
        // upload Dalle Image URL to firebase storage
        uploadToFirebase.mutate(noteId);
        router.push(`/note/${noteId}`);
      },
      onError: (e) => {
        console.error(e);
        window.alert("Failed to create note");
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        {/* Ensure consistent rendering of the button */}
        <div>
          <Button asChild>
            <span className="font-bold">Create Note</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
        </DialogHeader>
        Create a new note by clicking the button below
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            placeholder="Name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit" disabled={createNotebook.isPending}>
              {createNotebook.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
