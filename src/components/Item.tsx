import { useState } from "react";
import { View, Text, Linking, TouchableOpacity, ScrollView, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import Loads from "../constants/Loads.json";
import CameraUploader from "./Camera";
import CameraPicker from "./Camera";

type ItemScreenRouteProp = RouteProp<RootStackParamList, "Item">;

export function Item() {
  const route = useRoute<ItemScreenRouteProp>();
  const { id } = route.params;
  const load = Loads.loads.find((item) => item.id === id);

  const pickup = load?.map.pickupLocation;
  const dropOff = load?.map.dropOffLocation;

  const [imagemUri, setImagemUri] = useState<string | null>(null);
  console.log(imagemUri)

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 bg-gray-100 p-4">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-4">{load?.name}</Text>

        <View className="bg-white p-4 rounded-xl shadow-md mb-4">
          <Text className="text-lg text-gray-600">Value of load</Text>
          <Text className="text-5xl font-bold text-gray-900">{load?.value}</Text>
        </View>

        <View className="bg-white p-4 rounded-xl shadow-md mb-4">
          <Text className="text-lg font-semibold text-gray-700 mb-2">Additional Information</Text>
          <Text className="text-gray-800"><Text className="font-bold">Description:</Text> {load?.additionalInformation.description}</Text>
          <Text className="text-gray-800"><Text className="font-bold">Type of load:</Text> {load?.additionalInformation.type}</Text>
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


        {imagemUri && (
          <Image source={{ uri: imagemUri }} className="w-full h-40 rounded-lg border border-gray-400 mt-4" />
        )}
      </View>
    </ScrollView>
  );
}
