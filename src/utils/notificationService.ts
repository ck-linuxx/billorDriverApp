import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { supabase } from "./supabase";

export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) {
    alert("As notificações só funcionam em dispositivos reais.");
    return;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      alert("Permissão para receber notificações negada.");
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  await supabase.from("users").update({ push_token: token }).eq("id", userId);

  return token;
}
