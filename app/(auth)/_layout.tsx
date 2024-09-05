import { colors } from "@/constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ title: "Sign In", headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ title: "Sign Up", headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor={colors.primary.DEFAULT} style="light" />
    </>
  );
};

export default AuthLayout;
