import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import CustomText from "./CustomText";
import LeftArrow from "../assets/LeftArrow.svg";
import { tabBarRef } from "./HelperFunctions";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

type Props = {
  text?: string;
  destination?: string;
  color?: string;
  props?: object;
  navigation: any; //TODO: FIX THIS
};

const Header1: React.FC<Props> = ({
  text = "",
  destination = "Home",
  color = "white",
  props,
  navigation,
}) => {
  const styles = StyleSheet.create({
    Container: {
      marginHorizontal: PAGE_WIDTH * 0.05333333333,
    },
  });
  return (
    <SafeAreaView style={styles.Container} className="fixed top-0 z-10">
      <TouchableOpacity
        className="flex flex-row items-center py-2"
        onPressIn={() => {
          navigation.navigate(destination, props);
        }}
      >
        <LeftArrow className="" style={{ color: color }}></LeftArrow>
        <CustomText
          className="text-lg mx-2"
          fontThicknessNumber={3}
          style={{ color: color }}
        >
          {text}
        </CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Header1;
