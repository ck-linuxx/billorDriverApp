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
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";

function LoadsListComponent() {
  const { theme } = useTheme();
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
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View className="flex-1 p-4">
        <TextInput
          placeholder="Filter by name"
          placeholderTextColor={theme === "dark" ? "#A1A1AA" : "#6B7280"}
          value={searchName}
          onChangeText={setSearchName}
          className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white mb-4"
        />

        <View className="flex-row justify-around mb-4">
          {statuses.map(status => (
            <TouchableOpacity
              key={status}
              onPress={() =>
                setSelectedStatus(selectedStatus === status ? '' : status)
              }
              className={`px-4 py-2 rounded ${selectedStatus === status ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
                }`}
            >
              <Text className="text-white dark:text-black">{status}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setSelectedStatus('')}
            className={`px-4 py-2 rounded ${selectedStatus === '' ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
              }`}
          >
            <Text className="text-white dark:text-black">All</Text>
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

export default function LoadsList() {
  return (
    <ThemeProvider>
      <LoadsListComponent />
    </ThemeProvider>
  );
}
