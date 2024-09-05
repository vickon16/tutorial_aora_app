import CustomVideosPage from "@/components/CustomVideosPage";
import { getSearchVideos } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwirte";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

const Search = () => {
  const { query } = useLocalSearchParams();
  const newQuery = typeof query === "string" ? query : "";
  const { data: videos, refetch } = useAppwrite<
    Awaited<ReturnType<typeof getSearchVideos>>
  >(async () => await getSearchVideos(newQuery), []);

  useEffect(() => {
    refetch();
  }, [query]);

  return <CustomVideosPage type="search" videos={videos} query={newQuery} />;
};

export default Search;
