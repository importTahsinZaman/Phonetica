import { Image, Dimensions, View, TouchableOpacity } from "react-native";
import Banner from "../assets/HomeBanner.svg";

const HomeBanner = ({ navigation }) => {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const PAGE_HEIGHT = Dimensions.get("window").height;
  return (
    <View className="bg-white flex items-center justify-center w-screen">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Learn");
        }}
      >
        <Banner width={PAGE_WIDTH} height={PAGE_WIDTH * 0.41791044776}></Banner>
      </TouchableOpacity>
    </View>
  );
};

export default HomeBanner;
