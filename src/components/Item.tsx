import { View, Text } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";
import Loads from "../constants/Loads.json"

type ItemScreenRouteProp = RouteProp<RootStackParamList, "Item">;

export function Item() {
  const route = useRoute<ItemScreenRouteProp>();
  const { id } = route.params;
  const load = Loads.loads.find((item) => {
    return item.id === id;
  })

  console.log(load)

  return (
    <View className="flex flex-col p-2">
      <Text className="text-2xl self-center font-extrabold" >{load?.name}</Text>

    </View>
  );
}
