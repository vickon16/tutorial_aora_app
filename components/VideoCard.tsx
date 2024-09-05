import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { TVideoDocument } from "@/lib/types";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";
import { useGlobalContext } from "@/context/GlobalProvider";

type Props = {
  video: TVideoDocument;
};

const VideoCard = ({ video }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useGlobalContext();

  return (
    <View className="flex-col items-center px-4 mb-8">
      <View className="flex-row gap-2 items-center">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video.creator?.avatar }}
              className="w-full h-full rounded-lg "
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 gap-y-1 ml-2">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {video.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {video.creator.username}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-x-2 items-center">
          <Text className="text-xs text-white font-plight self-end">
            <Text className="font-pbold text-secondary">2</Text> likes
          </Text>
          {liked ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setLiked(false)}
              className="p-1"
            >
              <Image
                source={icons.heartRed}
                resizeMode="contain"
                className="w-5 h-5"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-gray-500/80 rounded-full p-1"
              onPress={() => setLiked(true)}
            >
              <Image
                source={icons.heartOutlined}
                resizeMode="contain"
                className="w-5 h-5"
              />
            </TouchableOpacity>
          )}
          <Image source={icons.menu} resizeMode="contain" className="w-5 h-5" />
        </View>
      </View>

      {playing ? (
        <Video
          source={{
            uri: video.video,
          }}
          resizeMode={ResizeMode.CONTAIN}
          className="w-full h-60 rounded-[15px] my-3"
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            /* @ts-ignore */
            if (status?.didJustFinish) {
              setPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.8}
          onPress={() => setPlaying(true)}
        >
          <Image
            source={{ uri: video.thumbnail }}
            resizeMode="cover"
            className="w-full h-full rounded-xl mt-3"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute rounded-xl mt-3"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
