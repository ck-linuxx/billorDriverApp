import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView>
      <View className="bg-backgroundLight h-[100vh] p-4">
        <View>
          <Text className="text-white text-4xl font-bold">Welcome!</Text>
          <Text className="text-white text-lg">Please enter your details to sign in</Text>
        </View>
        <View>
          <Text>Please enter your email:</Text>
          <TextInput keyboardType="email-address" 
            placeholder="Email"
            className="h-10 p-4 border rounded-xl"
          />
          <TextInput keyboardType="default" />
        </View>
      </View>
    </SafeAreaView>
  );
}