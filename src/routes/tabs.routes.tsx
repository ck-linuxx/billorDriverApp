import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"
import Feed from "../screens/Feed"
import New from "../screens/New"
import React from "react";
import StackRoutes from "./stack.routes";
import LoadsList from "../screens/LoadsList";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} >
      <Tab.Screen
        name="feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name="chat"
        component={New}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" color={color} size={size} />,
          tabBarLabel: "Chat"
        }}
      />
      <Tab.Screen
        name="loads"
        component={LoadsList}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="loader" color={color} size={size} />,
          tabBarLabel: "Loads"
        }}
      />
      <Tab.Screen
        name="profile"
        component={LoadsList}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
          tabBarLabel: "Profile"
        }}
      />
    </Tab.Navigator>
  );
}