"use client"
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import NoteTaking from "@/components/notes/note-taking";

export default function UserDashboard() {
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <div>
      <Card className="w-56 h-20 border-gray-700 cursor-pointer">
        <div
          className="flex flex-row items-center p-1 gap-3"
          onClick={() => setShowNoteModal(true)}
        >
          <Edit />
          <p className="text-gray-300">Start typing . . . . . . . .</p>
        </div>
      </Card>
      {showNoteModal && (
        <NoteTaking isOpen={true} onClose={() => setShowNoteModal(false)} />
      )}
    </div>
  );
}
