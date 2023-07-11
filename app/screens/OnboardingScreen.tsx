import Onboarding from "react-native-onboarding-swiper";
import { Dimensions, TouchableOpacity, View, SafeAreaView } from "react-native";
import CustomText from "../components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingImage1 from "../assets/OnboardingImage1.svg";
import OnboardingImage2 from "../assets/OnboardingImage2.svg";
import OnboardingImage3 from "../assets/OnboardingImage3.svg";
import OnboardingImage4 from "../assets/OnboardingImage4.svg";
import OnboardingImage5 from "../assets/OnboardingImage5.svg";
import { tabBarRef } from "../components/HelperFunctions";

import {
  requestTrackingPermissionsAsync,
  isAvailable,
} from "expo-tracking-transparency";

import Constants, { ExecutionEnvironment } from "expo-constants";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

// `true` when running in Expo Go.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let analytics: () => {
  (): any;
  new (): any;
  logEvent: { (arg0: string): any; new (): any };
};
if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  analytics = require("@react-native-firebase/analytics").default;
}

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const NextButtonComponent = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      className="mr-4 p-4 px-12 bg-[#FFBF23] rounded"
      style={{ bottom: 15 }}
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
      style={{ bottom: 15 }}
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
      style={{ bottom: 15 }}
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
        bottom: 15,
      }}
      className="rounded-full"
    />
  );
};

const OnboardingScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      tabBarRef?.current?.setVisible(false);
    }
  }, [isFocused]);
  return (
    <Onboarding
      allowFontScalingText={false}
      allowFontScalingButtons={false}
      flatlistProps={{
        virtualizedListProps: {
          // Enable virtualization here
          initialNumToRender: 5, // Adjust this value based on your use case
          windowSize: 5, // Adjust this value based on your use case
          removeClippedSubviews: true,
          // Other FlatList props...
        },
      }}
      bottomBarColor="white"
      bottomBarHighlight={false}
      NextButtonComponent={NextButtonComponent}
      SkipButtonComponent={SkipButtonComponent}
      DoneButtonComponent={DoneButtonComponent}
      DotComponent={DotComponent}
      skipToPage={4}
      titleStyles={{
        fontFamily: "SpaceGrotesk_700Bold",
        fontSize: PAGE_WIDTH * 0.06280193236,
      }}
      subTitleStyles={{
        fontFamily: "SpaceGrotesk_400Regular",
        fontSize: PAGE_WIDTH * 0.03864734299,
      }}
      controlStatusBar={false}
      onDone={async () => {
        const { status } = await requestTrackingPermissionsAsync();

        if (!isExpoGo) {
          if (status === "granted") {
            await analytics().logEvent("user_granted_tracking_access");
          } else {
            await analytics().logEvent("user_denied_tracking_access");
          }
        }

        const d = new Date();
        const date = d.toLocaleDateString();
        let time = d.toLocaleTimeString();
        time = time.slice(0, 4) + time.slice(7);

        const flashDef1 =
          "In this context, 'remember' means to retain and recall information or words that you have learned in the past. In the given sentence, it suggests that flashcards are useful for aiding the process of learning and retaining new words encountered during reading, and during flashcard review, you can indicate your familiarity with each word by selecting the appropriate emoji.";

        const flashDef2 =
          "Deck refers to a set of cards usually used in various games. In this context, 'deck' refers to a set of flashcards";

        const flashCardJson = JSON.stringify([
          {
            word: "Remember",
            instanceNumber: 1,
            text: "Flashcards help you learn and remember words you find while reading. When you're reviewing your flashcards, click the emoji that corresponds to how well you know the word.",
            definition: flashDef1,
            englishDefinition: flashDef1,
            feeling: 3,
          },

          {
            word: "Deck",
            instanceNumber: 1,
            text: "To add a flashcard to your deck, scan text, define a word, and at the bottom of your screen click 'Add Flashcard'!",
            definition: flashDef2,
            englishDefinition: flashDef2,
            feeling: 3,
          },
        ]);

        await AsyncStorage.multiSet([
          ["alreadyLaunched", "true"],
          [
            "RecentScan0",
            "Tutorial Scan: Use this text as a demo scan. In a cozy little town, there lived a girl named Lily. She loved exploring nature and had a magical ability to talk to animals. One sunny day, Lily met a squirrel named Nutmeg. Nutmeg told her about a hidden treasure in the nearby forest. Excited, they ventured into the woods together. Along the way, they encountered a wise owl, a mischievous rabbit, and a friendly deer. With their help, Lily and Nutmeg found the treasure—a sparkling necklace made of emeralds! Lily shared the treasure with her new animal friends, and they celebrated with a joyful dance. From that day on, they became inseparable companions, exploring the wonders of the world together.",
          ],
          [
            "RecentScan1",
            "Tutorial Scan: Use this text as a demo scan. In the bustling city of Brightville, there was a young boy named Max. Max had a passion for inventions and dreams of becoming a famous inventor someday. One afternoon, he discovered an old, dusty box in his grandfather's attic. Inside, he found a pair of goggles with peculiar gears and buttons. Curiosity sparked in Max's eyes as he put them on. To his amazement, the goggles transported him to a world filled with talking robots and flying cars. Max couldn't believe his eyes! He spent days exploring this futuristic realm, making new robotic friends and inventing incredible gadgets. When he returned home, Max knew that one day, he would turn his imagination into reality and change the world with his inventions.",
          ],
          ["RecentScan2", ""],
          ["RecentScan3", ""],
          ["RecentScan4", ""],
          ["RecentScanTime0", date + "&$&" + time],
          ["RecentScanTime1", date + "&$&" + time],
          ["RecentScanTime2", ""],
          ["RecentScanTime3", ""],
          ["RecentScanTime4", ""],
          ["ScanCount", "0"],
          ["Flashcards", flashCardJson],
        ]);

        if (isExpoGo) {
          console.log("completed onboarding");
        } else {
          await analytics().logEvent("completed_onboarding");
        }

        navigation.navigate("Home");
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
