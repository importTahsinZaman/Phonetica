import Onboarding from "react-native-onboarding-swiper";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { tabBarRef } from "../../App";

const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
      skipToPage={2}
      onDone={async () => {
        await AsyncStorage.setItem("alreadyLaunched", "true");
        await AsyncStorage.multiSet([
          ["RecentScan0", ""],
          ["RecentScan1", ""],
          ["RecentScan2", ""],
          ["RecentScan3", ""],
          ["RecentScan4", ""],
          ["RecentScanTime0", ""],
          ["RecentScanTime1", ""],
          ["RecentScanTime2", ""],
          ["RecentScanTime3", ""],
          ["RecentScanTime4", ""],
        ]);
        navigation.navigate("Home");
        tabBarRef?.current?.setVisible(true);
      }}
      pages={[
        {
          backgroundColor: "#fff",
          image: "",
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#fe6e58",
          image: "",
          title: "The Title",
          subtitle: "This is the subtitle that sumplements the title.",
        },
        {
          backgroundColor: "#999",
          image: "",
          title: "Triangle",
          subtitle: "Beautiful, isn't it?",
        },
      ]}
    />
  );
};

export default OnboardingScreen;
