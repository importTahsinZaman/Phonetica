import Header1 from "../components/Header1";
import {
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LearnScreen = ({}) => {
  const PAGE_WIDTH = Dimensions.get("window").width;

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
      className="flex justify-center items-center bg-white  h-screen w-screen"
    >
      <SafeAreaView className="flex items-center border-y-4 w-full bg-[#FFBF23] border-black">
        <Ionicons name="construct" size={50} color="black" />
        <CustomText fontThicknessNumber={4} className="text-2xl">
          COMING SOON!
        </CustomText>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default LearnScreen;
