import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from '../utils/supabase';


export async function registerForPushNotificationsAsync(userId: string) {
  let token;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    const { error } = await supabase
      .from('users')
      .update({ expo_push_token: token })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao salvar token no banco:', error);
    }
  } catch (error) {
    console.error('Erro ao registrar notificações:', error);
  }

  return token;
}

