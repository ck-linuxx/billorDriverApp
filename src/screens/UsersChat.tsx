import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import * as Notifications from 'expo-notifications';
import { Feather } from "@expo/vector-icons";

export default function UsersChat() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const getAvatarUrl = (userId: string) => {
    const { data } = supabase.storage.from('avatars').getPublicUrl(`avatars/${userId}.jpg`);
    return data.publicUrl;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      setMessages(data || []);
    };

    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        setMessages((prev) => [payload.new, ...prev]);

        const { data: recipient } = await supabase
          .from('users')
          .select('notification_token')
          .eq('id', payload.new.user_id)
          .single();

        if (recipient?.notification_token) {
          await sendPushNotification(recipient.notification_token, 'Nova mensagem', payload.new.content);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function sendPushNotification(expoPushToken: string, title: string, body: string) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title,
        body,
      }),
    });
  }

  const sendMessage = async () => {
    if (!message.trim()) return;
    await supabase.from('messages').insert([{ content: message, user_id: user?.id }]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <View className="flex-row items-center p-4 bg-black">
        <TouchableOpacity onPress={() => navigation.goBack()} />
        <Text className="text-white text-lg ml-4">Chat</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const avatarUrl = getAvatarUrl(item.user_id);
          return (
            <View className={`flex-row items-center p-3 ${item.user_id === user?.id ? 'self-end' : 'self-start'} m-2`}>
              <Image source={{ uri: avatarUrl }} className="w-8 h-8 rounded-full mr-2" />
              <View className="p-3 bg-gray-200 rounded-lg">
                <Text className="font-bold">{item.user_id === user?.id && user?.user_metadata.name}</Text>
                <Text>{item.content}</Text>
              </View>
            </View>
          );
        }}
        inverted
      />

      <View className="flex-row items-center p-3 border-t border-gray-200">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Digite uma mensagem..."
          className="flex-1 p-4 border border-gray-300 rounded-lg"
        />
        <TouchableOpacity onPress={sendMessage} className="ml-2 w-12 h-12 bg-black rounded-full items-center justify-center">
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
