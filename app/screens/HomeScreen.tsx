import Header1 from "../components/Header1";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBanner from "../components/HomeBanner";
import FeaturedBooks from "../components/FeaturedBooks";
import CustomText from "../components/CustomText";
import RecentScans from "../components/RecentScans";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="bg-white h-screen h-full w-full w-screen">
      <Header1></Header1>
      <HomeBanner navigation={navigation}></HomeBanner>
      <CustomText
        className="text-base"
        style={{ fontFamily: "SpaceGrotesk_700Bold" }}
      >
        Featured Books
      </CustomText>
      <FeaturedBooks></FeaturedBooks>
      <CustomText
        className="text-base"
        style={{ fontFamily: "SpaceGrotesk_700Bold" }}
      >
        Your Recent Scans
      </CustomText>
      <RecentScans></RecentScans>
    </SafeAreaView>
  );
};

export default HomeScreen;
