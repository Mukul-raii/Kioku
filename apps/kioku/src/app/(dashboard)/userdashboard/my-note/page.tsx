"use client";
import { get_all_learning_Log_stats } from "@/app/actions/learning-log";
import MyNotes from "@/components/notes/my-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LearningLogWithStats, MiniTopicForRevision } from "@repo/types";
import {  Grid3X3Icon, List } from "lucide-react";
import { useEffect, useState } from "react";

export default function MyNote() {
  const [isTable, setIsTable] = useState(true);
  const [data ,setData] = useState<LearningLogWithStats[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await get_all_learning_Log_stats()
        setData(res.learningLogsWithStats)
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="m-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <div className=" flex flex-row gap-2">
            <Button variant={"outline"} onClick={() => setIsTable(true)}>
              <List />
            </Button>
            <Button variant={"outline"} onClick={() => setIsTable(false)}>
              <Grid3X3Icon />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-between  ">
          <Input className="w-64 sm:w-96" placeholder="Search notes..." />
          <div className=" flex flex-row gap-3">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <MyNotes isTable={isTable} Data={data} />
      </div>
    </div>
  );
}
