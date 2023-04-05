import Header1 from "../components/Header1";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";

const HomeScreen = ({}) => {
  const PAGE_WIDTH = Dimensions.get("window").width;

  return (
    <SafeAreaView className="flex flex-col bg-white h-screen h-full w-full w-screen">
      <CustomText>WIP</CustomText>
    </SafeAreaView>
  );
};

export default HomeScreen;
