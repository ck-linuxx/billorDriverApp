import { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../themes/ThemeProvider";
import { useAuth } from "../hooks/AuthContext";
import { supabase } from "../utils/supabase";

interface IUser {
  email: string | undefined;
  username: string | undefined;
  avatar_url: string | undefined;
}

export default function Profile() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userData: IUser = user?.user_metadata || {};
  console.log(user)

  const [username, setUsername] = useState(userData.username || "");
  const [avatarUrl, setAvatarUrl] = useState(userData.avatar_url || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", user.id)
          .single();
        if (data) {
          setUsername(data.name);
          setAvatarUrl(data.avatar_url);
        }
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "The name cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ name: username })
      .eq("id", user?.id);

    if (!error) {
      setIsEditing(false);
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("name")
        .eq("id", user?.id)
        .single();
      if (data && !fetchError) {
        setUsername(data.name);
      }
    } else {
      Alert.alert("Error", "Failed to update username.");
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const fileName = `avatars/${user?.id}.jpg`;
      const { data, error } = await supabase.storage.from("avatars").upload(fileName, uri, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: urlData.publicUrl } });

      if (updateError) throw updateError;

      setAvatarUrl(urlData.publicUrl);
    } catch (error: any) {
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  return (
    <View className="flex-1 p-6 bg-white dark:bg-black">
      <Text className="text-black dark:text-white text-2xl font-semibold text-center mt-8">Account</Text>
      <TouchableOpacity onPress={handlePickImage} className="self-center mt-6">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-24 h-24 rounded-full" />
        ) : (
          <View className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full justify-center items-center">
            <Feather name="user" size={32} color="gray" />
          </View>
        )}
      </TouchableOpacity>
      <View className="flex-row items-center justify-between px-4 mt-6">
        <Text className="text-black dark:text-white text-lg font-medium">Name</Text>
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
        <TextInput
          className="border border-gray-300 dark:border-gray-600 p-3 rounded mt-2 text-black dark:text-white"
          value={username}
          onChangeText={setUsername}
          autoFocus
        />
      ) : (
        <Text className="text-gray-500 dark:text-gray-400 text-lg px-4 mt-2">{username}</Text>
      )}
      <View className="mt-6 px-4">
        <Text className="text-black dark:text-white text-lg font-medium">Email</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-lg mt-2">{userData.email}</Text>
      </View>
      <TouchableOpacity onPress={() => supabase.auth.signOut()} className="mt-6 mx-4 p-3 bg-black dark:bg-white rounded-lg">
        <Text className="text-white dark:text-black text-center text-lg font-medium">Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleTheme} className="mt-4 mx-4 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg">
        <Text className="text-black dark:text-white text-center text-lg font-medium">Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
}
