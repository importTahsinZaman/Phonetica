import Header1 from "../components/Header1";
import { Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonComponent from "../components/SkeletonComponent";

const LearnScreen = ({}) => {
  const PAGE_WIDTH = Dimensions.get("window").width;

  return (
    <SafeAreaView className="flex justify-center items-center bg-white  h-screen w-screen">
      <SafeAreaView className="flex items-center border-y-4 w-full bg-[#FFBF23] border-black">
        <Ionicons name="construct" size={50} color="black" />
        <CustomText fontThicknessNumber={4} className="text-2xl">
          COMING SOON!
        </CustomText>
      </SafeAreaView>
      <SkeletonComponent />
      <TouchableOpacity
        onPress={() => {
          AsyncStorage.clear();
        }}
      >
        <CustomText>Secret Button</CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LearnScreen;
