import { db } from "@/lib/database";
import { $notes } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { noteId, editorState } = body;
    if (!noteId || !editorState) {
      return NextResponse.json({
        error: "Note ID and editor state is required",
      });
    }
    noteId = parseInt(noteId);
    const notes = await db.select().from($notes).where(eq($notes.id, noteId));
    if (notes.length != 1) {
      return NextResponse.json({ error: "Note not found" });
    }

    const note = notes[0];
    if (note.editorState !== editorState) {
      await db
        .update($notes)
        .set({ editorState: editorState })
        .where(eq($notes.id, noteId));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error, success: false });
  }
}
