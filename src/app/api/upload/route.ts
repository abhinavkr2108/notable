import { db } from "@/lib/database";
import { $notes } from "@/lib/database/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const { noteId } = await req.json();

    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)));
    if (notes.length != 1) {
      return NextResponse.json({ error: "Note not found" });
    }
    const note = notes[0];
    if (!note.imageUrl) {
      return NextResponse.json({ error: "Note has no image" });
    }

    const firebaseUrl = await uploadFileToFirebase(note.imageUrl, note.name);
    console.log("firebaseUrl", firebaseUrl);

    //update note with firebase url
    await db
      .update($notes)
      .set({ imageUrl: firebaseUrl })
      .where(eq($notes.id, parseInt(noteId)));
    return NextResponse.json({ success: true, imageUrl: firebaseUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error, success: false });
  }
}
