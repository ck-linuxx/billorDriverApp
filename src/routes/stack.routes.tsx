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
import { registerForPushNotificationsAsync } from '../utils/notificationService';
import ChatScreen from '../screens/ChatScreen';


const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  const { theme, toggleTheme } = useTheme();


  return (
    <AuthProvider>
      <StatusBar
        barStyle={theme !== "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme !== "dark" ? "black" : "transparent"}
        translucent
      />
      <Routes />
    </AuthProvider>
  )
}

function Routes() {
  const { setAuth, user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setAuth(session.user);

        await registerForPushNotificationsAsync(session.user.id);

        navigation.reset({
          index: 0,
          routes: [{ name: 'tabs' }],
        });

        return;
      }

      setAuth(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="signUp" component={SignUp} />
        </>
      ) : (
        <>
          <Stack.Screen name="tabs" component={TabRoutes} />
          <Stack.Screen name="item" component={Item} />
          <Stack.Screen name="chatScreen" component={ChatScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
