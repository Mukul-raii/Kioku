import { Input } from "../ui/input";
import { Label } from "../ui/label";
import TailwindAdvancedEditor from "../textEditor";
import { ScrollArea } from "../ui/scroll-area";
import { BookOpen, Tag, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";

export default function NoteForm({
  topic,
  setTopic,
  category,
  setCategory,
  notes,
  setNotes,
  isSubmitting,
  onSubmit,
}: {
  topic: string;
  setTopic: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  notes: string | null;
  setNotes: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {

  function handleSubmit() {
    setNotes(notes);
    onSubmit();
  }
  return (
    <div className="space-y-4 max-h-[90vh] scrollbar-none overflow-auto ">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
            <Label className="font-medium ">Topic</Label>
          </div>
          <Input
            value={topic}
            type="text"
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What topic are you studying?"
            className="w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <Tag className="w-4 h-4 text-green-500 mr-2" />
            <Label className="font-medium ">Category</Label>
          </div>
          <Input
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 text-purple-500 mr-2" />
          <Label className="font-medium ">Notes</Label>
        </div>
        <ScrollArea className=" w-full  scrollbar-none ">
          <TailwindAdvancedEditor value={notes} onChange={(content) => {
            console.log("Editor onChange called with:", content);
            setNotes(content);
          }} />
        </ScrollArea>
      </div>

      <div className="flex justify-start ">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700  px-6"
        >
          {isSubmitting ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
}
