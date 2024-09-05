import {
  View,
  Text,
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { colors, icons } from "@/constants";

type Props = {
  formType: "text" | "email" | "password";
  title: string;
  value: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
};

const FormField = ({
  formType,
  title,
  value,
  placeholder,
  handleChangeText,
  keyboardType,
  otherStyles,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <View className={cn("space-y-2", otherStyles)}>
        <Text className="text-md text-gray-100 font-pmedium">{title}</Text>

        <View className="border-2 border-black-200 w-full h-14 px-4 bg-black-100 rounded-xl focus:border-secondary flex-row items-center">
          <TextInput
            value={value}
            className="flex-1 text-white font-psemibold text-md"
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.gray.placeholder}
            keyboardType={keyboardType}
            secureTextEntry={formType === "password" && !showPassword}
          />

          {formType === "password" && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default FormField;
