"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import NoteTaking from "@/components/notes/note-taking";
import ProcessPageView from "@/components/ProcessPageView";
import { getProgress } from "@/app/actions/quick-review";
import { useUser } from "@clerk/nextjs";

export default function UserDashboard() {
  const { user } = useUser();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [learningLogs, setLearningLogs] = useState([]);
  const [reviewThisMonth, setReviewThisMonth] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [retention, setRetention] = useState(0);
  const [masteredTopics, setMasteredTopics] = useState([]);
  const [masteredTopicCount, setMasteredTopicCount] = useState(0);

  useEffect(() => {
    if (!user.id) return;

    async function fetchData() {
      try {
        const res = await getProgress(user.id);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [user , user.id]); 


  return (
    <div className="flex justify-center items-center flex-col w-full p-10">
      <div className="flex  justify-between items-center w-full ">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card className="w-56 h-12 border border-gray-700 cursor-pointer">
          <div
            className="flex items-center justify-start gap-2 h-full px-3"
            onClick={() => setShowNoteModal(true)}
          >
            <Edit className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-300">Start typing...</p>
          </div>
        </Card>
      </div>
     <div className="flex flex-col gap-6 mx-5 my-10 w-full">
          <ProcessPageView retention={retention} masteredTopics={masteredTopics} masteredTopicCount={masteredTopicCount} />
        </div>

      {showNoteModal && (
        <NoteTaking isOpen={true} onClose={() => setShowNoteModal(false)} />
      )}
    </div>
  );
}
