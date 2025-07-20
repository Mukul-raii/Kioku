"use client";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { newLearningLogs } from "@/app/actions/learning-log";
import { useUser } from "@clerk/nextjs";
import TailwindAdvancedEditor from "../textEditor";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { IconX, IconBook2, IconTag, IconCalendar } from "@tabler/icons-react";
import { Button } from "../ui/button";
import NoteForm from "./note-form";

export default function NoteTaking({
  isOpen,
  onClose,
  renderInline = false,
  settopic,
  setcategory,
  note,
}) {
  const [topic, setTopic] = useState(settopic ? settopic : "");
  const [category, setCategory] = useState(setcategory ? setcategory : "");
  const [notes, setNotes] = useState(note ? note : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const onSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const date = new Date().toISOString();
      console.log(notes);

      const res = await newLearningLogs({
        topic,
        category,
        notes,
        date,
        user: user?.id || "",
      });

      // Reset form after successful submission
      if (res) {
        setTopic("");
        setCategory("");
        setNotes("");
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [topic, category, notes, user]);

  // Handle the renderInline prop or dialog mode
  if (renderInline) {
    return (
      <div className="w-full max-w-5xl p-4 sm:p-6 mx-auto  rounded-lg shadow-sm ">
        <h2 className="text-xl font-semibold mb-6">Add New Note</h2>
        <NoteForm
          topic={topic}
          setTopic={setTopic}
          category={category}
          setCategory={setCategory}
          notes={notes}
          setNotes={setNotes}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  // For dialog mode
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl w-full p-6 mx-4 scrollbar-none">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Add New Note
              </DialogTitle>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <IconX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>
          <NoteForm
            topic={topic}
            setTopic={setTopic}
            category={category}
            setCategory={setCategory}
            notes={notes}
            setNotes={setNotes}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export function cleanNote() {
  window.localStorage.removeItem("novel-content");
}
