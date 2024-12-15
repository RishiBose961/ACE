import { useQuery } from "@tanstack/react-query";
import InformationProfileUrl from "../InformationProfileUrl/InformationProfileUrl";

const useFetchSkill = () => {
  const {profileDatas} = InformationProfileUrl()

    
    const {
        isPending,
        error,
        isError,
        data: fetchSkill,
      } = useQuery({
        queryKey: ["fetchSkills",profileDatas?._id],
        queryFn: async () => {
          return await fetch(`/api/get-skill/${profileDatas?._id}`, {
            method: 'GET',
          
          }).then((res) => res.json());
        },
      });
  
  
    
      if (isError) {
        return <span>Error: {error.message}</span>;
      }


      return { isPending, fetchSkill:fetchSkill?.userInfoSkills };
}

export default useFetchSkill