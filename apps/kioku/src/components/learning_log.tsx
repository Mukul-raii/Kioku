"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { newLearningLogs } from "@/app/actions/learning-log";
import { useUser } from "@clerk/nextjs";
export default function New_Learning_Log() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const { user } = useUser();

  const date = new Date().toISOString();

  async function onSubmit() {
    const res = await newLearningLogs({
      topic,
      category,
      notes,
      date,
      user: user?.id || "",
    });
    console.log(res);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-2">
        <Label>Topic</Label>
        <Input
          value={topic}
          type="text"
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What topic are you studying?"
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
