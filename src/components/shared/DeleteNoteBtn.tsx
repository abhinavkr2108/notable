"use client";
import React from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DeleteNoteBtnProps {
  noteId: number;
}

export default function DeleteNoteBtn({ noteId }: DeleteNoteBtnProps) {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/delete`, {
        noteId,
      });
      return response.data;
    },
  });

  const handleDelete = () => {
    deleteNote.mutate(undefined, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        {/* Ensure consistent rendering of the button */}
        <div>
          <Button variant={"destructive"}>
            <span className="font-bold flex items-center gap-2">
              <Trash className="h-6 w-6" />
              Delete Note
            </span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
        </DialogHeader>
        Are you sure you want to delete this note?
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
