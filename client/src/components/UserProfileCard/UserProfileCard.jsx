import { useQuery } from "@tanstack/react-query";
import { Edit2Icon } from "lucide-react";
import { Link, useParams } from "react-router"; // Changed to "react-router-dom" for compatibility
import FollowButton from "../../Hook/FollowButton/FollowButton";
import useFetchSkill from "../../Hook/SkillHook/useFetchSkill";
import UserUpdateProfile from "./UserUpdateProfile";

const UserProfileCard = () => {
  const { username } = useParams();

  const { isPending: isSkillLoading, fetchSkill } = useFetchSkill();

  const {
    isPending: isProfileLoading,
    error,
    isError,
    data: profileData,
  } = useQuery({
    queryKey: ["profileDatas", username],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${username}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (isProfileLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 relative">
              <img
                src={profileData?.avatar || "default-avatar.png"} // Fallback for missing avatar
                alt={`${profileData?.name}'s profile picture`}
                className="rounded-full"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="lg:flex flex-row justify-start items-center space-x-6">
                <div>
                  <h1 className="text-3xl font-bold">
                    {profileData?.name || "Unknown User"}
                  </h1>
                  <p>
                    {isSkillLoading ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      fetchSkill?.[0]?.category || "No category available"
                    )}
                  </p>
                </div>
                <div className="flex justify-center items-center space-x-4 m-4">
                  <FollowButton diffProfile={profileData?._id} />
                  <Link to="/new">
                    <Edit2Icon className="cursor-pointer hover:text-cyan-500" />
                  </Link>
                  <UserUpdateProfile />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {fetchSkill?.[0]?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fetchSkill[0].skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full capitalize bg-red-600/30 text-red-100 text-sm flex items-center gap-1"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">No skills available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
