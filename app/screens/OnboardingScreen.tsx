import { useCallback } from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Dimensions, SafeAreaView, TouchableOpacity, View } from "react-native";
import CustomText from "../components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingImage1 from "../assets/OnboardingImage1.svg";
import OnboardingImage2 from "../assets/OnboardingImage2.svg";
import OnboardingImage3 from "../assets/OnboardingImage3.svg";
import OnboardingImage4 from "../assets/OnboardingImage4.svg";
import OnboardingImage5 from "../assets/OnboardingImage5.svg";
import { tabBarRef } from "../../App";
import * as SplashScreen from "expo-splash-screen";
import LanguagePicker from "../components/LanguagePicker";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

SplashScreen.preventAutoHideAsync();

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
      skipToPage={4}
      titleStyles={{ fontFamily: "SpaceGrotesk_700Bold" }}
      subTitleStyles={{ fontFamily: "SpaceGrotesk_400Regular" }}
      onDone={async () => {
        await AsyncStorage.multiSet([
          ["alreadyLaunched", "true"],
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
              width={PAGE_WIDTH * 0.9}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.9}
              viewBox="0 0 650 650"
            ></OnboardingImage1>
          ),
          title: "Welcome to Phonetica!",
          subtitle: "",
        },
        {
          backgroundColor: "#fff",
          image: (
            <OnboardingImage2
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.9}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.9}
              viewBox="0 0 620 620"
            ></OnboardingImage2>
          ),
          title: "Easily Scan Books",
          subtitle:
            "Take a picture of your book and Phonetica will recognize words, sentences, and paragraphs. Select what you would like to learn more about.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <OnboardingImage3
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.9}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.9}
              viewBox="0 0 640 640"
            ></OnboardingImage3>
          ),
          title: "Translate to your Native Language",
          subtitle:
            "Read your book in a language you understand! Our AI technology ensures you receive a translation that actually makes sense.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <OnboardingImage4
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.9}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.9}
              viewBox="0 0 640 640"
            ></OnboardingImage4>
          ),
          title: "Read Explanations and Definitions",
          subtitle:
            "Select words and sentences you don't understand and Phonetica will explain definitions in context!",
        },
        {
          backgroundColor: "#fff",
          image: (
            <OnboardingImage5
              //Width is page width * 2 * horizontal margin of elements
              width={PAGE_WIDTH * 0.9}
              //Height is svg width times aspect ratio multiplier
              height={PAGE_WIDTH * 0.9}
              viewBox="0 0 640 640"
            ></OnboardingImage5>
          ),
          title: "Time to read English!",
          subtitle:
            "Thank you for installing Phonetica! Please leave a review if you enjoy your experience. Have fun!",
        },
      ]}
    />
  );
};

export default OnboardingScreen;
