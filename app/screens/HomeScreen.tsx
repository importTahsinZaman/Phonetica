import Header1 from "../components/Header1";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBanner from "../components/HomeBanner";

const HomeScreen = ({}) => {
  return (
    <SafeAreaView>
      <Header1></Header1>
      <HomeBanner></HomeBanner>
    </SafeAreaView>
  );
};

export default HomeScreen;
