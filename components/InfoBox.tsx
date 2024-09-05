import { View, Text } from "react-native";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string | number;
  subtitle?: string;
  containerStyle?: string;
  titleStyles?: string;
};

const InfoBox = ({ title, subtitle, containerStyle, titleStyles }: Props) => {
  return (
    <View className={cn(containerStyle)}>
      <Text
        className={cn("text-white text-center font-psemibold", titleStyles)}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className={cn("text-gray-100 text-sm text-center font-pregular")}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default InfoBox;
