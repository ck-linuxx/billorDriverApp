import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import TabRoutes from './tabs.routes';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Item } from '../components/Item';
import { ThemeProvider, useTheme } from '../themes/ThemeProvider';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from '../hooks/AuthContext';
import { supabase } from '../utils/supabase';
import ChatScreen from '../screens/UsersChat';
import { registerForPushNotificationsAsync } from '../utils/notificationService';


const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  const { theme, toggleTheme } = useTheme();


  return (
    <AuthProvider>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "black" : "transparent"}
        translucent
      />
      <Routes />
    </AuthProvider>
  )
}

function Routes() {
  const { setAuth } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setAuth(session.user);

        const token = await registerForPushNotificationsAsync(session.user.id);
        console.log('Token recebido:', token);
        console.log('user id:', session.user.id);

        navigation.navigate('tabs');
        return;
      }

      setAuth(null);
      navigation.navigate('login');
    });
  }, []);



  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signUp" component={SignUp} />
      <Stack.Screen name="tabs" component={TabRoutes} />
      <Stack.Screen name="item" component={Item} />
      <Stack.Screen name="chatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}