import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"
import Feed from "../screens/Feed"
import New from "../screens/New"
import React from "react";
import LoadsList from "../screens/LoadsList";
import ChatScreen from "../components/Chat";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} >
      <Tab.Screen
        name="feed"
        component={Feed}
        options={{
          tabBarActiveTintColor: "black",
          tabBarIcon: ({ size }) => <Feather name="home" color={"black"} size={size} />,
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name="chat"
        component={ChatScreen}
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
        component={LoadsList}
        options={{
          tabBarActiveTintColor: "black",
          tabBarIcon: ({ size }) => <Feather name="user" color={"black"} size={size} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}