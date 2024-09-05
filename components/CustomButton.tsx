import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading = false,
}: Props) => {
  return (
    <TouchableOpacity
      className={cn(
        `bg-secondary rounded-xl min-h-[55px] justify-center items-center`,
        containerStyles,
        {
          "opacity-50": isLoading,
        }
      )}
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text className={cn("text-primary font-psemibold text-lg", textStyles)}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
