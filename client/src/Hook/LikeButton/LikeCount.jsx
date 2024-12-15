/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";

const LikeCount = ({ postedId }) => {
  const {
    isPending,
    error,
    isError,
    data: fetchLikeCount,
  } = useQuery({
    queryKey: ["fetchLikeCounts", postedId],
    queryFn: async () => {
      return await fetch(`/api/get-count/${postedId}`, {
        method: "GET",
      }).then((res) => res.json());
    },
  });

  if (isPending)
    return (
      <div>
        <span className="loading loading-ring loading-sm"></span>
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  return <div>{fetchLikeCount?.count}</div>;
};

export default LikeCount;
