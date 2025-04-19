import ReviewList from "@/components/review";
import New_Learning_Log from "@/components/learning_log";

export default function UserDashboard(params: type) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello i am muik</p>
      <New_Learning_Log />
      <div className=" border border-amber-400">
        <ReviewList />
      </div>
    </div>
  );
}
