import Header1 from "../components/Header1";
import { Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBanner from "../components/HomeBanner";
import FeaturedBooks from "../components/FeaturedBooks";
import CustomText from "../components/CustomText";
import RecentScans from "../components/RecentScans";

const HomeScreen = ({}) => {
  const PAGE_WIDTH = Dimensions.get("window").width;

  return (
    <SafeAreaView>
      <Header1></Header1>
      <HomeBanner></HomeBanner>
      <CustomText className="text-xl">Featured Books</CustomText>
      <FeaturedBooks></FeaturedBooks>
      <CustomText>Your Recent Scans</CustomText>
      <RecentScans></RecentScans>
    </SafeAreaView>
  );
};

export default HomeScreen;
