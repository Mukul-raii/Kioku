"use client";
import { getProgress } from "@/app/actions/quick-review";
import ProcessPageView from "@/components/ProcessPageView";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";

export default function ProgressPage() {
  const { user } = useUser();
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
    <div className="flex flex-col gap-6 mx-5 my-10">
      <ProcessPageView retention={retention} masteredTopics={masteredTopics} masteredTopicCount={masteredTopicCount} />
    </div>
  );
}
