import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import LeftArrow from "../assets/LeftArrow.svg";
import { tabBarRef } from "../../App";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

type Props = {
  text?: string;
  destination?: string;
  color?: string;
  showNavBar?: boolean;
  navigation: any; //TODO: FIX THIS
};

const Header1: React.FC<Props> = ({
  text = "",
  destination = "Home",
  color = "white",
  showNavBar = true,
  navigation,
}) => {
  const styles = StyleSheet.create({
    Text: {
      fontSize: PAGE_HEIGHT * 0.02,
    },
  });
  return (
    <View className="fixed top-0">
      <TouchableOpacity
        className="flex flex-row"
        onPress={() => {
          navigation.goBack();
          tabBarRef?.current?.setVisible(showNavBar);
        }}
      >
        <LeftArrow style={{ color: color }}></LeftArrow>
        <CustomText style={(styles.Text, { color: color })}>{text}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default Header1;
