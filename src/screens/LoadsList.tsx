import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { LoadItem } from "../components/LoadItem";
import LoadsData from "../constants/Loads.json";

export default function LoadsList() {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchName, setSearchName] = useState('');

  const statuses = ['in transit', 'delivered', 'cancelled'];

  const filteredLoads = LoadsData.loads.filter(load => {
    if (selectedStatus && load.status !== selectedStatus) {
      return false;
    }
    if (searchName && !load.name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View className="flex-1 p-4">
        <TextInput
          placeholder="Filter by name"
          value={searchName}
          onChangeText={setSearchName}
          className="p-4 rounded-lg border border-gray-300 mb-4"
        />

        <View className="flex-row justify-around mb-4">
          {statuses.map(status => (
            <TouchableOpacity
              key={status}
              onPress={() =>
                setSelectedStatus(selectedStatus === status ? '' : status)
              }
              className={`px-4 py-2 rounded ${selectedStatus === status ? "bg-blue-500" : "bg-gray-300"
                }`}
            >
              <Text className="text-white">{status}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setSelectedStatus('')}
            className={`px-4 py-2 rounded ${selectedStatus === '' ? "bg-blue-500" : "bg-gray-300"
              }`}
          >
            <Text className="text-white">All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredLoads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LoadItem status={item.status} title={item.name} loadId={item.id} />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
