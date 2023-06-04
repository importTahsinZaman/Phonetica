import Onboarding from "react-native-onboarding-swiper";
import { Dimensions, TouchableOpacity, View } from "react-native";
import CustomText from "../components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingImage1 from "../assets/OnboardingImage1.svg";

import { tabBarRef } from "../../App";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const NextButtonComponent = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      className="mr-4 p-4 px-12 bg-[#FFBF23] rounded "
    >
      <CustomText fontThicknessNumber={4}>Next</CustomText>
    </TouchableOpacity>
  );
};

const SkipButtonComponent = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      className="ml-4 p-4 px-12  bg-[#FFBF23] rounded "
    >
      <CustomText fontThicknessNumber={4}>Skip</CustomText>
    </TouchableOpacity>
  );
};

const DoneButtonComponent = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      className="mr-4 p-4 px-12 bg-[#FFBF23] rounded "
    >
      <CustomText fontThicknessNumber={4}>Done</CustomText>
    </TouchableOpacity>
  );
};

const DotComponent = ({ selected }) => {
  let backgroundColor, width;
  backgroundColor = selected ? "#FFBF23" : "#D9D9D9";
  width = selected ? 18 : 8;

  return (
    <View
      style={{
        width,
        height: 8,
        marginHorizontal: 3,
        backgroundColor,
      }}
      className="rounded-full"
    />
  );
};

const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
      bottomBarColor="white"
      bottomBarHighlight={false}
      NextButtonComponent={NextButtonComponent}
      SkipButtonComponent={SkipButtonComponent}
      DoneButtonComponent={DoneButtonComponent}
      DotComponent={DotComponent}
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
          image: (
            <OnboardingImage1
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.89333333334}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.89333333334 * 0.49253731343}
              viewBox="0 0 196 173"
            ></OnboardingImage1>
          ),
          title: "Easily Scan Books",
          subtitle: "",
        },
        {
          backgroundColor: "#fff",
          image: (
            <OnboardingImage1
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.89333333334}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.89333333334 * 0.49253731343}
              viewBox="0 0 335 165"
            ></OnboardingImage1>
          ),
          title: "Translate to your Native Language",
          subtitle: "",
        },
        {
          backgroundColor: "#fff",
          image: (
            <OnboardingImage1
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.89333333334}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.89333333334 * 0.49253731343}
              viewBox="0 0 335 165"
            ></OnboardingImage1>
          ),
          title: "Read in-depth Explanations and Definitions",
          subtitle: "",
        },
      ]}
    />
  );
};

export default OnboardingScreen;
