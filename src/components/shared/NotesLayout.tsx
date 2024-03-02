import React from "react";
import CreateNoteDialog from "./CreateNoteDialog";

export default function NotesLayout() {
  return (
    <div className="grid-cols-1 mt-8 container mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <CreateNoteDialog />
    </div>
  );
}
