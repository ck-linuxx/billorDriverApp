import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Feed from '../screens/Feed';
import TabRoutes from './tabs.routes';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { Item } from '../components/Item';
import { ThemeProvider, useTheme } from '../themes/ThemeProvider';
import { StatusBar } from 'react-native';


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

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user)
        navigation.navigate('tabs');
        return;
      }

      setAuth(null)
      navigation.navigate('login');
    })

  }, [])


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signUp" component={SignUp} />
      <Stack.Screen name="tabs" component={TabRoutes} />
      <Stack.Screen name="item" component={Item} />
    </Stack.Navigator>
  );
}