import CustomVideosPage from "@/components/CustomVideosPage";
import { getLatestVideos, getVideos } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwirte";
import React from "react";

const Bookmark = () => {
  const { data: videos, refetch: refetchVideos } = useAppwrite<
    Awaited<ReturnType<typeof getVideos>>
  >(getVideos, []);

  const onRefresh = async () => {
    await refetchVideos();
  };

  return (
    <CustomVideosPage type="bookmark" videos={videos} onRefresh={onRefresh} />
  );
};

export default Bookmark;
