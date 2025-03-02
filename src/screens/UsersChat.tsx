import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks/AuthContext';
import { supabase } from '../utils/supabase';
import { Feather } from "@expo/vector-icons"
import { useTheme } from '../themes/ThemeProvider';
import { registerForPushNotificationsAsync } from '../utils/notificationService';

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { theme } = useTheme();
  const receiverId = route.params?.receiverId;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);


  useEffect(() => {
    if (!user) return;

    if (user?.id) {
      registerForPushNotificationsAsync(user.id);
    }

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .neq('id', user.id);

      if (error) console.error('Erro ao buscar usuários:', error);
      setUsers(data || []);
    };

    fetchUsers();

    const subscription = supabase
      .channel('users')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'users' }, (payload) => {
        setUsers((prevUsers) => {
          if (!prevUsers.some((user) => user.id === payload.new.id)) {
            return [...prevUsers, payload.new];
          }
          return prevUsers;
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === payload.new.id ? payload.new : user))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);



  useEffect(() => {
    if (!user || !receiverId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar mensagens:', error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new;
        if (
          (newMessage.sender_id === user.id && newMessage.receiver_id === receiverId) ||
          (newMessage.sender_id === receiverId && newMessage.receiver_id === user.id)
        ) {
          setMessages((prevMessages) => {
            if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
              return [newMessage, ...prevMessages];
            }
            return prevMessages;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, receiverId]);



  const sendMessage = async () => {
    if (!message.trim() || !receiverId) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ content: message, sender_id: user.id, receiver_id: receiverId }])
      .select();

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      return;
    }

    setMessages((prevMessages) => [data[0], ...prevMessages]);
    setMessage('');

    const { data: receiverData, error: receiverError } = await supabase
      .from('users')
      .select('expo_push_token')
      .eq('id', receiverId)
      .single();

    if (receiverError) {
      console.error('Erro ao buscar token do destinatário:', receiverError);
      return;
    }

    if (!receiverData?.expo_push_token) {
      console.log('Destinatário não tem token de push registrado.');
      return;
    }

    console.log('Enviando notificação para:', receiverData.expo_push_token);
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: receiverData.expo_push_token,
          sound: 'default',
          title: 'Nova mensagem!',
          body: message,
          data: { senderId: user.id },
        }),
      });

      const responseData = await response.json();
      console.log('Resposta do Expo Push:', responseData);
    } catch (err) {
      console.error('Erro ao enviar notificação push:', err);
    }
  };




  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <View className={`flex-row items-center p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-black'}`}>
        <TouchableOpacity onPress={() => navigation.goBack()} />
        <Text className={`text-lg ml-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Chat</Text>
      </View>

      {!receiverId ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              onPress={() => navigation.navigate('chatScreen', { receiverId: item.id })}
            >
              <Text className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className={`p-3 ${item.sender_id === user.id ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200') : (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')} rounded-lg m-2`}>
              <Text className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{item.users?.name || 'Usuário Desconhecido'}</Text>
              <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.content}</Text>
              <Text className={`text-xs text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.created_at}</Text>
            </View>
          )}
          inverted
        />
      )}

      {receiverId && (
        <View className={`flex-row items-center p-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder='Digite uma mensagem...'
            className={`flex-1 p-4 border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} rounded-lg text-${theme === 'dark' ? 'white' : 'black'}`}
          />
          <TouchableOpacity onPress={sendMessage} className={`ml-2 p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-black'} rounded-full`} >
            <Feather name="send" color={"white"} size={20} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
