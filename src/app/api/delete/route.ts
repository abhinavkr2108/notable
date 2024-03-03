import { db } from "@/lib/database";
import { $notes } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { noteId } = body;
    if (!noteId) {
      return new NextResponse("Note ID is required", { status: 400 });
    }
    const note = await db.delete($notes).where(eq($notes.id, noteId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error, success: false });
  }
}
