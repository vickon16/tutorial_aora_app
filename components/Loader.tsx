import { View, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "@/constants";

type Props = {
  size?: number | ("large" | "small");
};

const Loader = ({ size = "small" }: Props) => {
  return (
    <View className="w-full bg-primary h-full flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={colors.secondary.DEFAULT} />
    </View>
  );
};

export default Loader;
