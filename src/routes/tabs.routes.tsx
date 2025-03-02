import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"
import React from "react";
import LoadsList from "../screens/LoadsList";
import Profile from "../screens/Profile";
import UsersChat from "../screens/UsersChat";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} >
      <Tab.Screen
        name="chat"
        component={UsersChat}
        options={{
          tabBarActiveTintColor: "black",
          tabBarIcon: ({ size }) => <Feather name="message-circle" color={"black"} size={size} />,
          tabBarLabel: "Chat"
        }}
      />
      <Tab.Screen
        name="loads"
        component={LoadsList}
        options={{
          tabBarActiveTintColor: "black",
          tabBarIcon: ({ size }) => <Feather name="loader" color={"black"} size={size} />,
          tabBarLabel: "Loads"
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarActiveTintColor: "black",
          tabBarIcon: ({ size }) => <Feather name="user" color={"black"} size={size} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}