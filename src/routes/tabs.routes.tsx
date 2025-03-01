import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"
import Feed from "../screens/Feed"
import New from "../screens/New"
import React from "react";
import StackRoutes from "./stack.routes";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} >
      <Tab.Screen 
        name="fedd"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
          tabBarLabel: "Inicio"
        }}
      />
      <Tab.Screen 
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="plus" color={color} size={size} />,
          tabBarLabel: "Novo"
        }}
      />
      <Tab.Screen 
        name="stack"
        component={StackRoutes}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="star" color={color} size={size} />,
          tabBarLabel: "Stack"
        }}
      />
    </Tab.Navigator>
  );
}