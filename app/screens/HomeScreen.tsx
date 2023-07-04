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
