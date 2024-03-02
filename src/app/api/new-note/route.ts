import { db } from "@/lib/database";
import { $notes } from "@/lib/database/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userId = auth().userId;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { name } = body;

  const imageDescription = await generateImagePrompt(name);
  if (!imageDescription) {
    return new NextResponse("Failed to generate image description", {
      status: 500,
    });
  }

  const imageUrl = await generateImage(imageDescription);
  if (!imageUrl) {
    return new NextResponse("Failed to generate image", { status: 500 });
  }

  const notesIds = await db
    .insert($notes)
    .values({
      name: name,
      userId: userId,
      imageUrl: imageUrl,
    })
    .returning({ insertedId: $notes.id });

  console.log({ imageDescription });

  return NextResponse.json({
    noteId: notesIds[0].insertedId,
  });
}
