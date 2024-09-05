import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import * as z from "zod";
import { signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignInScreen = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    const result = signInSchema.safeParse(form);
    if (!result.success) {
      Alert.alert("Error", result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await signIn(form.email, form.password);
      if (!session) throw new Error();
      setIsLoggedIn(true);
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, height: "100%" }}>
        <View className="w-full justify-center flex-1 px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[130px] h-[84px]"
          />

          <Text className="text-xl text-white font-psemibold mt-4 mb-7">
            Log in to Aora
          </Text>

          <FormField
            formType="email"
            title="Email"
            value={form.email}
            handleChangeText={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e,
              }))
            }
            keyboardType="email-address"
            otherStyles="mt-4"
          />

          <FormField
            formType="password"
            title="Password"
            value={form.password}
            handleChangeText={(e) =>
              setForm((prev) => ({
                ...prev,
                password: e,
              }))
            }
            otherStyles="mt-4"
          />

          <CustomButton
            title="Sign In"
            isLoading={isSubmitting}
            handlePress={submit}
            containerStyles="mt-7"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link
              href="/sign-up"
              className="text-sm font-psemibold text-secondary"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;
