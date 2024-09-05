import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import VideoCard from "@/components/VideoCard";
import { colors, icons, images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwrite";
import { TVideoDocument } from "@/lib/types";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoBox from "./InfoBox";

type DefaultProps = {
  videos: TVideoDocument[];
  onRefresh?: () => Promise<void>;
};

type CustomProps =
  | {
      type: "home";
      query?: never;
      latestVideos: TVideoDocument[];
    }
  | {
      type: "bookmark";
      query?: never;
      latestVideos?: never;
    }
  | {
      type: "search";
      query: string;
      latestVideos?: never;
    }
  | {
      type: "profile";
      query?: never;
      latestVideos?: never;
    };

type Props = DefaultProps & CustomProps;

const CustomVideosPage = ({
  type,
  videos,
  latestVideos,
  onRefresh,
  query,
}: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const logout = async () => {
    if (type !== "profile") return;
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        keyExtractor={(item) => item.$id}
        data={videos ?? []}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={() =>
          !user ? (
            <Redirect href="/sign-in" />
          ) : (
            <>
              {type === "home" || type === "search" || type === "bookmark" ? (
                <View className="my-6 px-3 space-y-3">
                  <View className="justify-between items-start flex-row my-4">
                    <View className="space-y-1">
                      <Text className="font-pmedium text-sm text-gray-100">
                        {type === "home"
                          ? "Welcome Back"
                          : type === "bookmark"
                          ? "saved videos"
                          : "Search Results"}
                      </Text>
                      <Text className="text-2xl font-psemibold text-white">
                        {type === "home"
                          ? user.username
                          : type === "bookmark"
                          ? "Bookmarks"
                          : query || "Query"}
                      </Text>
                    </View>

                    <View className="mt-2">
                      <Image
                        source={images.logoSmall}
                        className="w-9 h-10"
                        resizeMode="contain"
                      />
                    </View>
                  </View>

                  <SearchInput initialQuery={query} />

                  {type === "home" && (
                    <View className="w-full py-2">
                      <Text className="text-gray-100 text-base font-pregular">
                        Latest Videos
                      </Text>

                      <Trending videos={latestVideos ?? []} />
                    </View>
                  )}
                </View>
              ) : (
                <View className="w-full justify-center items-center mt-6 mb-8 px-4">
                  <TouchableOpacity
                    className="w-full items-end mb-6"
                    onPress={logout}
                  >
                    <Image
                      source={icons.logout}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                    <Image
                      source={{ uri: user?.avatar }}
                      className="w-[90%] h-[90%] rounded-lg"
                      resizeMode="cover"
                    />
                  </View>

                  <InfoBox
                    title={user.username}
                    containerStyle="mt-3"
                    titleStyles="text-lg"
                  />

                  <View className="my-3 flex-row ">
                    <InfoBox
                      title={videos.length || 0}
                      subtitle="Videos"
                      containerStyle="mr-10"
                      titleStyles="text-xl"
                    />
                    <InfoBox
                      title="1.2k"
                      subtitle="Followers"
                      titleStyles="text-xl"
                    />
                  </View>
                </View>
              )}
            </>
          )
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle={
              type === "home" || type === "profile"
                ? "Create your first video"
                : "No results found"
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              if (!!onRefresh) {
                setRefreshing(true);
                await onRefresh();
                setRefreshing(false);
              }
            }}
          />
        }
      />

      <StatusBar backgroundColor={colors.primary.DEFAULT} style="light" />
    </SafeAreaView>
  );
};

export default CustomVideosPage;
