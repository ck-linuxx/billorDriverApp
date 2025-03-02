import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../themes/Colors";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/SignIn";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";


export default function SignIn() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema)
  });

  async function onSubmit(data) {
    setLoading(true);

    const { response, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      Alert.alert("Error", error.message)
      setLoading(false)
      return;
    }

    setLoading(false)
    navigation.navigate("tabs")
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View className="h-full p-4 flex justify-center gap-3">
              <View className="bg-white p-4 rounded-lg">
                <View className="mb-3">
                  <Text className="text-black text-4xl font-extrabold">Welcome back!</Text>
                </View>

                <View className="flex gap-2">
                  <Text className="text-black text-xl">E-mail address:</Text>
                  <TextInput
                    keyboardType="email-address"
                    placeholder="Email"
                    className="h-14 p-4 border border-black rounded-lg placeholder:text-black text-black"
                    onChangeText={(text) => setValue("email", text)}
                  />
                  {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
                </View>

                <View className="flex gap-2 mt-4 relative">
                  <Text className="text-black text-xl">Password:</Text>
                  <TextInput
                    secureTextEntry={!passwordVisible}
                    placeholder="Password"
                    className="h-14 p-4 pr-12 border border-black rounded-lg placeholder:text-black text-black w-full"
                    onChangeText={(text) => setValue("password", text)}
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-4 top-11"
                  >
                    <Feather
                      name={passwordVisible ? "eye" : "eye-off"}
                      size={24}
                      color={Colors.black}
                    />
                  </TouchableOpacity>
                  {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
                </View>

                <View className="flex my-4 gap-6">
                  <TouchableOpacity className="bg-black p-4 rounded-lg" onPress={handleSubmit(onSubmit)}>
                    <Text className="text-white text-xl self-center">Sign In</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate("signUp")}>
                    <Text className="text-black text-xl self-center">Don't have an account?</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
