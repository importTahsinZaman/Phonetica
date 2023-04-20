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
          width={PAGE_WIDTH * 0.89}
          height={PAGE_HEIGHT * 0.21}
          viewBox="0 0 335 165"
        ></Banner>
      </TouchableOpacity>
    </View>
  );
};

export default HomeBanner;
