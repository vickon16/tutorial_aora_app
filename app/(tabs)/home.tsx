import CustomVideosPage from "@/components/CustomVideosPage";
import { getLatestVideos, getVideos } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwirte";
import React from "react";

const Home = () => {
  const { data: videos, refetch: refetchVideos } = useAppwrite<
    Awaited<ReturnType<typeof getVideos>>
  >(getVideos, []);

  const { data: latestVideos, refetch: refetchLatestVideos } = useAppwrite<
    Awaited<ReturnType<typeof getLatestVideos>>
  >(getLatestVideos, []);

  const onRefresh = async () => {
    await Promise.all([refetchLatestVideos(), refetchVideos()]);
  };

  return (
    <CustomVideosPage
      type="home"
      videos={videos}
      latestVideos={latestVideos}
      onRefresh={onRefresh}
    />
  );
};

export default Home;
