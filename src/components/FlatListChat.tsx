import { FlatList, TouchableOpacity, Text, View } from "react-native";
import { theme } from "../../tailwind.config";
import { useNavigation } from "@react-navigation/native";
import { User } from "@supabase/supabase-js";
import React from "react";
import { useTheme } from "../themes/ThemeProvider";
import { useAuth } from "../hooks/AuthContext";

interface IFlatListChat {
  users: any | null;
  receiverId: string;
  messages: any[];
}

export default function FlatListChat({ users, receiverId, messages }: IFlatListChat) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const getUserName = (userId: string) => {
    return users?.find(user => user.id === userId)?.name;
  };

  if (users.length === 0) return (
    <View className="flex-1 flex items-center justify-center">
      <Text className="text-2xl font-bold text-black dark:text-white">No user available</Text>
    </View>
  )

  return !receiverId ? (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          className={`p-3 bg-black dark:bg-gray-700 rounded-lg m-2  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          onPress={() => navigation.navigate('chatScreen', { receiverId: item.id })}
        >
          <Text className={`text-lg text-white`}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  ) : (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className={`p-3 ${item.sender_id === user.id ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-500') : (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')} rounded-lg m-2`}>
          <Text className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{getUserName(item.sender_id)}</Text>
          <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.content}</Text>
          <Text className={`text-xs text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.created_at
              ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
                new Date(`1970-01-01T${item.created_at}Z`)
              )
              : 'Hora inválida'}
          </Text>
        </View>
      )}
    />
  )
};