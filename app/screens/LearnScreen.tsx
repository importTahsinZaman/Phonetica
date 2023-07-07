import { Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { tabBarRef } from "../components/HelperFunctions";

const LearnScreen = ({}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      tabBarRef?.current?.setVisible(true);
    }
  }, [isFocused]);

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
