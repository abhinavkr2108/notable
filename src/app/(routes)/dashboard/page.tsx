import Header from "@/components/shared/Header";
import NotesLayout from "@/components/shared/NotesLayout";

import React from "react";

export default async function DashboardPage() {
  return (
    <div>
      <Header />
      <NotesLayout />
    </div>
  );
}
