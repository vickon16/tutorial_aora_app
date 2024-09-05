import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { icons } from "@/constants";
import { createVideo } from "@/lib/appwrite";
import { TFormVideo } from "@/lib/types";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "@/context/GlobalProvider";

const defaultState: TFormVideo = {
  title: "",
  video: null,
  prompt: "",
  thumbnail: null,
};

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<TFormVideo>(defaultState);
  const { user } = useGlobalContext();

  const openPicker = async (type: "video" | "image") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      Alert.alert("Document Cancelled", JSON.stringify(result, null, 2));
      return;
    }

    switch (type) {
      case "video":
        setForm((prev) => ({ ...prev, video: result.assets[0] }));
        break;
      case "image":
        setForm((prev) => ({ ...prev, thumbnail: result.assets[0] }));
        break;
      default:
        setForm((prev) => ({ ...prev, video: null, thumbnail: null }));
    }
  };

  const submit = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in to upload videos");
      return router.push("/sign-in");
    }
    const { prompt, title, video, thumbnail } = form;
    if (!prompt || !title || !video || !thumbnail) {
      Alert.alert("Error", "Please fill out the form");
      return;
    }

    setUploading(true);
    try {
      await createVideo({ ...form, creator: user?.$id });
      Alert.alert("Success", "Video uploaded successfully");
      router.push("/home");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
      Alert.alert("Error", "Failed to upload video");
    } finally {
      // setForm(defaultState);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        className="px-2 py-6 space-y-6"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text className="text-xl text-white font-psemibold">Upload Video</Text>

        <FormField
          formType="text"
          title="Video Title"
          value={form.title}
          placeholder="Give your video a title"
          handleChangeText={(e) => setForm((prev) => ({ ...prev, title: e }))}
          otherStyles="mt-7"
        />

        <View className="space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {!!form.video ? (
              <Video
                source={form.video}
                resizeMode={ResizeMode.COVER}
                className="w-full h-40 rounded-[15px]"
                shouldPlay
              />
            ) : (
              <View className="w-full h-40 p-2 bg-black-100 rounded-xl justify-center items-center">
                <View className="w-full h-full border border-dashed border-secondary-100/50 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/3 h-1/3"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {!!form.thumbnail ? (
              <Image
                source={form.thumbnail}
                resizeMode="cover"
                className="w-full h-40 rounded-[15px]"
              />
            ) : (
              <View className="w-full h-28 p-2 bg-black-100 rounded-xl justify-center items-center">
                <View className="w-full h-full border border-dashed border-secondary-100/50 justify-center items-center gap-y-1">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/4 h-1/4"
                  />
                  <Text className="text-gray-300 text-xs font-pmedium">
                    Choose a file
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          formType="text"
          title="Prompt"
          value={form.prompt}
          placeholder="The prompt for your video"
          handleChangeText={(e) => setForm((prev) => ({ ...prev, prompt: e }))}
          otherStyles="mt-5"
        />

        <CustomButton
          title="Submit & Publish"
          isLoading={uploading}
          handlePress={submit}
          containerStyles="mt-7 mb-10 w-full"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
