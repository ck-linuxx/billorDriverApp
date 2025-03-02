import { NavigationContainer } from "@react-navigation/native"
import StackRoutes from "./stack.routes"
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar
} from "react-native";
import { ThemeProvider, useTheme } from "../themes/ThemeProvider";


export default function Routes() {

  return (
    <NavigationContainer>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView className="flex-1 bg-white">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <ThemeProvider>
                  <StackRoutes />
                </ThemeProvider>

              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  )
}