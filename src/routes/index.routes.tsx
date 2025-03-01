import { NavigationContainer } from "@react-navigation/native"
import TabRoutes from "./tabs.routes"
import StackRoutes from "./stack.routes"
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

export default function Routes() {
  return (
    <NavigationContainer>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StackRoutes />
      </SafeAreaProvider>
    </NavigationContainer>
  )
}