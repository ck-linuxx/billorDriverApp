import { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeProvider";
import { useAuth } from "../hooks/AuthContext";
import { supabase } from "../utils/supabase";
import * as FileSystem from "expo-file-system";

interface IUser {
  email: string | undefined;
  username: string | undefined;
  profileImage: string | undefined;
}

export default function Profile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userData: IUser = user?.user_metadata || {};

  const [username, setUsername] = useState(userData.username || "");
  const [avatarUrl, setAvatarUrl] = useState(userData.profileImage || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      if (!error && data) setUsername(data.name);
    };
    fetchUserData();
  }, [user?.id]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "The name cannot be empty.");
      return;
    }

    const { error } = await supabase.from("users").update({ name: username }).eq("id", user?.id);
    if (!error) setIsEditing(false);
  };

  return (
    <View className={`flex-1 p-6 ${theme === "dark" ? 'bg-gray-800' : "bg-white"}`}>
      <Text className={`text-2xl font-semibold text-center mt-8 ${theme === "dark" ? "text-white" : "text-black"}`}>Account</Text>
      <View className="flex-row items-center justify-between px-4 mt-6">
        <Text className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Name</Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleUpdateUsername}>
            <Feather name="check" size={20} color={theme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Feather name="edit-2" size={18} color={theme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
        )}
      </View>
      {isEditing ? (
        <TextInput className="border p-3 rounded mt-2 text-black dark:text-white border-gray-300 dark:border-gray-600" value={username} onChangeText={setUsername} autoFocus />
      ) : (
        <Text className="text-lg px-4 mt-2 text-gray-500 dark:text-gray-400">{username}</Text>
      )}
      <View className="mt-6 px-4">
        <Text className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Email</Text>
        <Text className="text-lg mt-2 text-gray-500 dark:text-gray-400">{userData.email}</Text>
      </View>
      <TouchableOpacity onPress={() => supabase.auth.signOut()} className="mt-6 mx-4 p-3 bg-black dark:bg-white rounded-lg">
        <Text className="text-center text-lg font-medium text-white dark:text-black">Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleTheme} className="mt-4 mx-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <Text className="text-center text-lg font-medium text-black dark:text-white">Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
}