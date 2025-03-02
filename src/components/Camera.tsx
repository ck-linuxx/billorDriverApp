import { useState } from "react";
import { View, Image, Alert, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import uuid from "react-native-uuid";

interface CameraPickerProps {
  id: string;
}

export default function CameraPicker({ id }: CameraPickerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Enable camera access to continue.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const fileName = `photos/${id}-${uuid.v4()}.jpg`;

      // Converte a imagem para um formato compatível
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: fileName,
        type: "image/jpeg",
      } as any);

      const { error } = await supabase.storage.from("images").upload(fileName, formData);

      if (error) throw new Error(error.message);

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      await saveImageToDatabase(imageUrl);

      Alert.alert("Success", "Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error.message);
      Alert.alert("Error", "Unable to upload the image.");
    }
  };

  const saveImageToDatabase = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from("images")
        .insert([{ load_id: id, image_url: imageUrl }]);

      if (error) throw new Error(error.message);
    } catch (error: any) {
      console.error("Database error:", error.message);
      Alert.alert("Error", "Unable to save the image to the database.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      {imageUri && (
        <Image source={{ uri: imageUri }} className="w-40 h-40 rounded-lg border border-gray-700" />
      )}

      <TouchableOpacity onPress={takePhoto} className="bg-black py-4 px-6 rounded-lg mt-4">
        <Text className="text-white text-center text-lg font-semibold">Upload a photo</Text>
      </TouchableOpacity>
    </View>
  );
}
