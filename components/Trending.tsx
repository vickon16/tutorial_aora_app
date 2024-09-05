import { icons } from "@/constants";
import { TVideoDocument } from "@/lib/types";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";

const zoomIn = {
  from: { scale: 0.85, opacity: 0.85 },
  to: { scale: 1, opacity: 1 },
};

const zoomOut = {
  from: { scale: 1, opacity: 1 },
  to: { scale: 0.85, opacity: 0.85 },
};

type Props = {
  videos: TVideoDocument[];
};

type TrendingItemProps = {
  activeVideo: string;
  video: TVideoDocument;
};
const TrendingItem = ({ activeVideo, video }: TrendingItemProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <Animatable.View
      className="mr-1"
      animation={activeVideo === video.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playing ? (
        <Video
          source={{
            uri: video.video,
          }}
          resizeMode={ResizeMode.CONTAIN}
          className="w-52 h-72 rounded-[15px] my-3 bg-white/10"
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
          className="relative justify-center items-center"
          activeOpacity={0.8}
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{ uri: video.thumbnail }}
            className="w-52 h-72 rounded-[15px] my-4 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ videos }: Props) => {
  const [activeVideo, setActiveVideo] = useState(videos[0]?.$id);

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.$id}
      onViewableItemsChanged={({ viewableItems }) => {
        if (viewableItems.length > 0) {
          setActiveVideo(viewableItems[0].key);
        }
      }}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 100,
      }}
      contentOffset={{ x: 0, y: 0 }}
      renderItem={({ item: video }) => (
        <TrendingItem activeVideo={activeVideo} video={video} />
      )}
      horizontal
    />
  );
};

export default Trending;
