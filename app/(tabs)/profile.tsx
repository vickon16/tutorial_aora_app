import CustomVideosPage from "@/components/CustomVideosPage";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getUserVideos } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwirte";
import React from "react";

const Profile = () => {
  const { user } = useGlobalContext();
  const { data: videos, refetch } = useAppwrite<
    Awaited<ReturnType<typeof getUserVideos>>
  >(async () => await getUserVideos(user?.$id), []);

  return <CustomVideosPage type="profile" videos={videos} />;
};

export default Profile;
