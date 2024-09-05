import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";
import * as z from "zod";
import { useGlobalContext } from "@/context/GlobalProvider";

const signUpSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

type TSignUpForm = z.infer<typeof signUpSchema>;

const SignUpScreen = () => {
  const [form, setForm] = useState<TSignUpForm>({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    const result = signUpSchema.safeParse(form);
    if (!result.success) {
      Alert.alert("Error", result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await createUser(
        form.username,
        form.email,
        form.password
      );

      if (!session) throw new Error();
      setIsLoggedIn(true);
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "Failed to create user");
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
            Sign up to Aora
          </Text>

          <FormField
            formType="text"
            title="Username"
            value={form.username}
            handleChangeText={(e) =>
              setForm((prev) => ({
                ...prev,
                username: e,
              }))
            }
            otherStyles="mt-4"
          />

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
            title="Sign Up"
            isLoading={isSubmitting}
            handlePress={submit}
            containerStyles="mt-7"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-sm font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
