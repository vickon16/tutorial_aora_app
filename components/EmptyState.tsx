import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

type Props = {
  title: string;
  subtitle: string;
};

const EmptyState = ({ title, subtitle }: Props) => {
  return (
    <View className="justify-center items-center px-4 text-center ">
      <Image
        source={images.empty}
        className="w-[250px] h-[200px]"
        resizeMode="contain"
      />

      <Text className="font-pmedium text-xs text-gray-100">{title}</Text>
      <Text className="text-base font-psemibold text-white">{subtitle}</Text>

      <CustomButton
        title="Create video"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-4"
      />
    </View>
  );
};

export default EmptyState;
