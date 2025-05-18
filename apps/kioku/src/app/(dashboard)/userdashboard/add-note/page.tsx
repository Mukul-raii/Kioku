"use client";
import NoteTaking from "@/components/notes/note-taking";

export default function AddNotePage() {
  return (
    <div className="w-full min-h-screen  flex items-center justify-center px-4 py-8">
        <NoteTaking
          renderInline={true}
          onClose={() => console.log("Note saved")}
        />
    </div>
  );
}
