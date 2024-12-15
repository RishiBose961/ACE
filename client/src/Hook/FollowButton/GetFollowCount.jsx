import { useQuery } from "@tanstack/react-query";
import InformationProfileUrl from "../InformationProfileUrl/InformationProfileUrl";

const GetFollowCount = () => {
    const {profileDatas} = InformationProfileUrl()

    const {
        isPending,
        error,
        isError,
        data: fetchFollowsData,
      } = useQuery({
        queryKey: ["fetchFollowsDatas",profileDatas?._id],
        queryFn: async () => {
          return await fetch(`/api/get-following/${profileDatas?._id}`, {
            method: 'GET',
          
          }).then((res) => res.json());
        },
      });
  
  
    
      if (isError) {
        return <span>Error: {error.message}</span>;
      }

      return { isPending, fetchFollowsData };

}

export default GetFollowCount