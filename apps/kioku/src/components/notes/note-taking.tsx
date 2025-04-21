"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { newLearningLogs } from "@/app/actions/learning-log";
import { useUser } from "@clerk/nextjs";
import TailwindAdvancedEditor from "../textEditor";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { X, BookOpen, Tag, CalendarDays } from "lucide-react";

export default function NoteTaking({ isOpen, onClose }) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  
  async function onSubmit() {
    try {
      setIsSubmitting(true);

      console.log(notes);
      
      const date = new Date().toISOString();
      const res = await newLearningLogs({
        topic,
        category,
        notes,
        date,
        user: user?.id || "",
      });
      console.log(res);
      
      
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
  }

  const NoteForm = () => (
    <div className="space-y-6 ">
      <div className="space-y-2">
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
          <Label className="font-medium text-white">Topic</Label>
        </div>
        <Input
          value={topic}
          type="text"
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What topic are you studying?"
          className="w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Tag className="w-4 h-4 text-green-500 mr-2" />
          <Label className="font-medium text-white">Category</Label>
        </div>
        <Input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 text-purple-500 mr-2" />
          <Label className="font-medium text-white">Notes</Label>
        </div>
          <ScrollArea className="h-64 w-full">
            <TailwindAdvancedEditor value={notes} onChange={setNotes} />
          </ScrollArea>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isSubmitting ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );

  // For dialog mode
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-800">Add New Note</DialogTitle>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>
          <NoteForm />
        </DialogContent>
      </Dialog>
    );
  }
  
  // For inline mode (used directly on a page)
  return (
    <div className=" shadow-sm  p-6 mx-102">
      <h2 className="text-xl font-semibold text-white mb-6">Add New Note</h2>
      <NoteForm />
    </div>
  );
}