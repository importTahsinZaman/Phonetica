import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import Header1 from "../components/Header1";
import HomeBanner from "../components/HomeBanner";
import FeaturedVideos from "../components/FeaturedVideos";
import CustomText from "../components/CustomText";
import RecentScans from "../components/RecentScans";
import Flashcards from "../components/Flashcards";
import { tabBarRef } from "../components/HelperFunctions";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const Content = ({ navigation }) => {
  return (
    <View>
      <Header1></Header1>
      <HomeBanner navigation={navigation}></HomeBanner>
      {/* Featured videos not yet completed: */}
      {/* <CustomText
        className="text-base"
        fontThicknessNumber={4}
        style={styles.Header}
      >
        Featured Videos
      </CustomText>
      <FeaturedVideos></FeaturedVideos> */}
      <CustomText
        className="text-base"
        fontThicknessNumber={4}
        style={styles.Header}
      >
        Flashcards
      </CustomText>
      <Flashcards navigation={navigation}></Flashcards>
      <CustomText
        className="text-base"
        fontThicknessNumber={4}
        style={styles.Header}
      >
        Your Recent Scans
      </CustomText>
      <RecentScans navigation={navigation}></RecentScans>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const checkAndAskReview = async () => {
    try {
      const askReviewTimesJSONString: string | null =
        await AsyncStorage.getItem("AskReviewTimes");

      const openCountSinceLastReviewAsk = parseInt(
        await AsyncStorage.getItem("OpenCountSinceLastReviewAsk")
      );

      const askReviewTimes = JSON.parse(askReviewTimesJSONString);
      let newAskReviewTimes = askReviewTimes;
      const NOW = new Date().getTime();
      const STORE_REVIEW_HAS_ACTION = await StoreReview.hasAction();

      let willAskForReview = false;

      const checkForReview = async (time: number, removeFromIndex: number) => {
        if (
          NOW >= time &&
          openCountSinceLastReviewAsk >= 5 &&
          STORE_REVIEW_HAS_ACTION
        ) {
          willAskForReview = true;
          newAskReviewTimes.splice(removeFromIndex, 1);
        }
      };

      askReviewTimes.forEach((time: number, index: number) => {
        checkForReview(time, index);
      });

      if (willAskForReview) {
        await AsyncStorage.setItem("OpenCountSinceLastReviewAsk", "0");
        StoreReview.requestReview();
      } else {
        const newOpenCount = openCountSinceLastReviewAsk + 1;
        await AsyncStorage.setItem(
          "OpenCountSinceLastReviewAsk",
          newOpenCount.toString()
        );
      }

      await AsyncStorage.setItem(
        "AskReviewTimes",
        JSON.stringify(newAskReviewTimes)
      );
    } catch (e) {
      if (__DEV__) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      tabBarRef?.current?.setVisible(true);

      checkAndAskReview();
    }
  }, [isFocused]);

  return (
    <SafeAreaView
      className="bg-white h-screen w-full"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {PAGE_HEIGHT < 785 ? (
        <ScrollView>
          <Content navigation={navigation}></Content>
          <View style={{ height: 785 - PAGE_HEIGHT, width: PAGE_WIDTH }}></View>
        </ScrollView>
      ) : (
        <Content navigation={navigation}></Content>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Header: {
    marginHorizontal: PAGE_WIDTH * 0.05333333333,
  },
});

export default HomeScreen;
