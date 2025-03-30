import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { useColorTheme } from "@/hooks/useColorTheme";
import FloatingLabelInput from "./FloatingLableInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "./ErrorMessage";
import TextButton from "../TextButton";
import { router } from "expo-router";
import { shadows } from "@/styles/shadows";

const SingInSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Invalid email address"
    ),
  password: yup.string().required("Password is required"),
});

type FormData = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const colors = useColorTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(SingInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/react-logo.png")} />
      <View style={[styles.subContainer, { borderColor: colors["gray-300"] }]}>
        <Text style={[styles.signinText, { color: colors["gray-800"] }]}>
          Sign in
        </Text>
        <View style={styles.inputContainer}>
          <FloatingLabelInput
            control={control}
            name="email"
            label="Email"
            placeholder="Email"
            icon="email"
          />
          {errors.email && <ErrorMessage message={errors.email.message!} />}
        </View>
        <View style={styles.inputContainer}>
          <FloatingLabelInput
            control={control}
            name="password"
            label="Password"
            placeholder="Password"
            icon="lock"
          />
          {errors.password && (
            <ErrorMessage message={errors.password.message!} />
          )}
        </View>
        <TextButton
          style={styles.signinButton}
          onPress={() => {
            console.log("Forgot password");
          }}
          title="Forgot password?"
          titleStyle={{
            ...styles.titleStyle,
            color: colors.primary,
            textDecorationColor: colors.primary,
          }}
        />
        <TextButton
          title="Sign in"
          onPress={handleSubmit(onSubmit)}
          style={{ width: "100%" }}
        />
        <View style={styles.noAccountContainer}>
          <Text style={{ ...styles.noAccountText, color: colors["gray-600"] }}>
            Don't have an account?
          </Text>
          <TextButton
            title="Sign up"
            onPress={() => router.navigate("/signup")}
            style={styles.signupButton}
            titleStyle={{
              ...styles.signupTitle,
              color: colors.primary,
              textDecorationColor: colors.primary,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 20,
    width: "100%",
    minHeight: "100%",
  },
  subContainer: {
    display: "flex",
    gap: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    boxShadow: shadows["shadow-1"],
  },
  signinText: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    padding: 5,
    gap: 4,
  },
  signinButton: {
    padding: 0,
    margin: 0,
    borderRadius: 0,
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  titleStyle: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  noAccountContainer: {
    width: "100%",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  noAccountText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "300",
  },
  signupButton: {
    paddingVertical: 0,
    paddingHorizontal: 2,
    margin: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  signupTitle: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
