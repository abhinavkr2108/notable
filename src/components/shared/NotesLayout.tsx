import React from "react";
import CreateNoteDialog from "./CreateNoteDialog";
import { db } from "@/lib/database";
import { $notes } from "@/lib/database/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardHeader } from "../ui/card";
import Link from "next/link";
import Image from "next/image";

export default async function NotesLayout() {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const notes = await db.select().from($notes).where(eq($notes.userId, userId));

  return (
    <div className="container px-5 py-24 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden"
          >
            <Image
              className="h-48 md:h-48 w-full object-cover object-center"
              src={note.imageUrl || ""}
              alt="blog"
              width={500}
              height={500}
            />
            <div className="p-6">
              <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                {note.created_at.toDateString()}
              </h2>
              <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                {note.name}
              </h1>
              <p className="leading-relaxed mb-3">
                Click View Note to see the note created by you.
              </p>
              <div className="flex items-center flex-wrap ">
                <Link href={`/note/${note.id}`}>
                  <div className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0 cursor-pointer">
                    View Created Note
                    <svg
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
