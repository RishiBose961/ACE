import { useQuery } from "@tanstack/react-query";
import InformationProfileUrl from "../InformationProfileUrl/InformationProfileUrl";

const useContribution = () => {
    const {profileDatas} = InformationProfileUrl()

    const {
        isPending,
        error,
        isError,
        data: fetchContribution,
      } = useQuery({
        queryKey: ["fetchContributions",profileDatas?._id],
        queryFn: async () => {
          return await fetch(`/api/get-contribution/${profileDatas?._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((res) => res.json());
        },
      });
    
      if (isError) {
        return <span>Error: {error.message}</span>;
      }
      

      return { isPending, fetchContribution };
}

export default useContribution