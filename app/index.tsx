import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";

import { colors, images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function App() {
  const { isLoggedIn } = useGlobalContext();

  if (!!isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="w-full max-w-[380px] h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[130px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation. Embark on a journey of limitless
            exploration with Aora.
          </Text>

          <CustomButton
            title="Continue With Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>

        <StatusBar backgroundColor={colors.primary.DEFAULT} style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}
