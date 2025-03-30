import { SafeAreaView } from "react-native";
import React from "react";
import SignInForm from "@/components/form/SignInForm";
import { useColorTheme } from "@/hooks/useColorTheme";

export default function SignIn() {
  const colors = useColorTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors["primary-50"] }}>
      <SignInForm />
    </SafeAreaView>
  );
}
