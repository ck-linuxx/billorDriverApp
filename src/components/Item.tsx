import { useEffect, useState } from "react";
import { View, Text, Linking, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import Loads from "../constants/Loads.json";
import CameraPicker from "./Camera";
import { supabase } from "../lib/supabase";
import { Feather } from "@expo/vector-icons";

type ItemScreenRouteProp = RouteProp<RootStackParamList, "Item">;

type ImageData = {
  id: string;
  image_url: string;
};

export function Item() {
  const route = useRoute<ItemScreenRouteProp>();
  const { id } = route.params;
  const load = Loads.loads.find((item) => item.id === id);
  const [images, setImages] = useState<ImageData[]>([]);

  const pickup = load?.map.pickupLocation;
  const dropOff = load?.map.dropOffLocation;

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("images")
        .select("id, image_url")
        .eq("load_id", id);

      if (error) throw new Error(error.message);

      setImages(data || []);
    } catch (error: any) {
      console.error("Error fetching images:", error.message);
      Alert.alert("Error", "Could not load images.");
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("images")
        .delete()
        .eq("id", imageId);

      if (error) throw new Error(error.message);

      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
      Alert.alert("Success", "Image deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting image:", error.message);
      Alert.alert("Error", "Could not delete image.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 bg-gray-100 p-4">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-4">{load?.name}</Text>

        <View className="bg-white p-4 rounded-xl shadow-md mb-4">
          <Text className="text-lg text-gray-600">Value of Load</Text>
          <Text className="text-5xl font-bold text-gray-900">{load?.value}</Text>
        </View>

        <View className="bg-white p-4 rounded-xl shadow-md mb-4">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Additional Information</Text>
          <Text className="text-gray-800"><Text className="font-bold">Description:</Text> {load?.additionalInformation.description}</Text>
          <Text className="text-gray-800"><Text className="font-bold">Type of Load:</Text> {load?.additionalInformation.type}</Text>
          <Text className="text-gray-800"><Text className="font-bold">Weight:</Text> {load?.additionalInformation.weight}</Text>
        </View>

        {pickup && dropOff && (
          <View className="h-64 rounded-xl overflow-hidden shadow-md mb-4">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: pickup.latitude,
                longitude: pickup.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }} title="Pickup Location" description={pickup.address} />
              <Marker coordinate={{ latitude: dropOff.latitude, longitude: dropOff.longitude }} title="Drop Off Location" description={dropOff.address} />
            </MapView>
          </View>
        )}

        {load?.map.route && (
          <TouchableOpacity
            className="bg-black py-4 rounded-xl shadow-md mt-4"
            onPress={() => Linking.openURL(load.map.route)}
          >
            <Text className="text-white text-center text-lg font-semibold">Open route in Google Maps</Text>
          </TouchableOpacity>
        )}

        <CameraPicker id={id} />

        {images.length > 0 ? (
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-900 mb-2">Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image) => (
                <View key={image.id} className="relative mr-2">
                  <TouchableOpacity key={image.id} onPress={() => Linking.openURL(image.image_url)}>
                    <Image
                      source={{ uri: image.image_url }}
                      className="w-40 h-40 rounded-lg border border-gray-400"
                      onError={(e) => console.log(`Error loading image:`, e.nativeEvent.error)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                    onPress={() => deleteImage(image.id)}
                  >
                    <Feather name="trash-2" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text className="text-center text-gray-500 mt-4">No images available.</Text>
        )}
      </View>
    </ScrollView>
  );
}