import { Image, Dimensions, View, TouchableOpacity } from "react-native";
import Banner from "../assets/HomeBanner.svg";

const HomeBanner = ({ navigation }) => {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const PAGE_HEIGHT = Dimensions.get("window").height;

  return (
    <View className="bg-white flex items-center justify-center w-screen ">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Learn");
        }}
      >
        <Banner
          //Width is page width * 2 * horizontal margin of elements
          width={PAGE_WIDTH * 0.89333333334}
          //Height is svg width times aspect ratio multiplier
          height={PAGE_WIDTH * 0.89333333334 * 0.49253731343}
          viewBox="0 0 335 165"
        ></Banner>
      </TouchableOpacity>
    </View>
  );
};

export default HomeBanner;
