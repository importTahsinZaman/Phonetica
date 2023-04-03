import { Image, Dimensions, View } from "react-native";
import SVGHomeBanner from "../components/SVGHomeBanner";

const HomeBanner = ({}) => {
  const width = Dimensions.get("window").width;
  return (
    <View className="bg-white">
      <SVGHomeBanner SVGWidth={`${width}`}></SVGHomeBanner>
    </View>
  );
};

export default HomeBanner;
