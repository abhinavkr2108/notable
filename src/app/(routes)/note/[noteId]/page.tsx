import Container from "@/components/shared/Container";
import DeleteNoteBtn from "@/components/shared/DeleteNoteBtn";
import TipTapEditor from "@/components/shared/TipTapEditor";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/database";
import { $notes } from "@/lib/database/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    noteId: string;
  };
};
export default async function NotesPage(props: Props) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  const user = await clerk.users.getUser(userId);

  if (!user) {
    return <div>User not found</div>;
  }

  const { noteId } = props.params;

  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

  if (notes.length != 1) {
    return <div>Note not found</div>;
  }
  const note = notes[0];

  return (
    <div className="h-screen w-full bg-violet-50">
      <Container>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/dashboard">
                  <Button variant={"default"}>
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="h-6 w-6" />
                      <p className="font-bold">Go Back</p>
                    </div>
                  </Button>
                </Link>
                <h1 className="font-bold ml-4">{user.firstName}</h1>
                <div className="mx-1">/</div>
                <h1 className="font-bold">{note.name}</h1>
              </div>
              <div>
                <DeleteNoteBtn noteId={note.id} />
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="mt-4">
          <Card className="px-12 pt-8">
            <TipTapEditor note={note} />
            <CardFooter>
              <div className="flex justify-end items-center w-full">
                Tip: Press{" "}
                <kbd className="font-sm font-semibold bg-gray-100 text-gray-800 px-1 py-2 mx-2">
                  Ctrl+Shift+A
                </kbd>{" "}
                for AI autocomplete
              </div>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
}
