import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/types";

interface ILoadItem {
  title: string;
  status: string;
  loadId: string;
}
interface ILoadItem {
  title: string;
  status: string;
  loadId: string;
}

export function LoadItem({ title, status, loadId }: ILoadItem) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate("item", { id: loadId })}
      className={`flex flex-row justify-between w-[90%] p-4 rounded-lg 
      ${status == "in transit" && "bg-textInputFill border-2 border-titleAndButtons"} 
      ${status == "delivered" && "bg-green-700 border-2 border-green-900"} 
      ${status == "cancelled" && "bg-red-700 border-2 border-red-900"} 
      ${status == "pending" && "bg-slate-700 border-2 border-gray-900 text-white"} 
    `}>
      <Text className={`text-xl 
        ${status !== "in transit" && "text-white"} 
      `}>
        {title}
      </Text>
      <Text className={`text-base
        ${status !== "in transit" && "text-white"} 
      `}>
        {status}
      </Text>
    </Pressable>
  )
}