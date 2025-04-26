



export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};


export const getDueStatus = (dateString:string) => {
  try {
    const reviewDate = new Date(dateString);
    const today = new Date();

    // Set time to midnight for comparison
    reviewDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (reviewDate.getTime() === today.getTime()) return "Today";
    if (reviewDate.getTime() < today.getTime()) return "Overdue";

    // Calculate days difference
    const diffTime = Math.abs(reviewDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;

    return formatDate(dateString);
  } catch (e) {
    return dateString;
  }
};
