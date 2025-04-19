import axios from "axios";

export const getAllRevision = async (userId: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/review/get_all_revision_topic`,
    { userId }
  );
  console.log(response);

  return response.data;
};
