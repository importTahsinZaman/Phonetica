import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Header1 from "../components/Header1";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBanner from "../components/HomeBanner";
import FeaturedBooks from "../components/FeaturedBooks";
import CustomText from "../components/CustomText";
import RecentScans from "../components/RecentScans";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="bg-white h-screen h-full w-full w-screen">
      <Header1></Header1>
      <HomeBanner navigation={navigation}></HomeBanner>
      <CustomText
        className="text-base"
        fontThicknessNumber={4}
        style={styles.Header}
      >
        Featured Books
      </CustomText>
      <FeaturedBooks></FeaturedBooks>
      <CustomText
        className="text-base"
        fontThicknessNumber={4}
        style={styles.Header}
      >
        Your Recent Scans
      </CustomText>
      <RecentScans></RecentScans>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Header: {
    marginHorizontal: PAGE_WIDTH * 0.05333333333,
  },
});

export default HomeScreen;
