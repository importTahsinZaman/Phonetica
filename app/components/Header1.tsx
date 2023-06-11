import { View, StyleSheet, Dimensions } from "react-native";
import LanguagePicker from "./LanguagePicker";
import CustomText from "./CustomText";
import Logo from "../assets/logo.svg";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const Header1 = ({}) => {
  return (
    <View
      style={styles.Container}
      className="bg-white flex-row justify-between items-center"
    >
      <View className="flex flex-row items-center">
        <Logo
          width={PAGE_WIDTH * 0.0845410628}
          height={PAGE_WIDTH * 0.0845410628}
        ></Logo>
        <CustomText style={styles.Title}>Phonetica</CustomText>
      </View>

      <LanguagePicker></LanguagePicker>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    marginHorizontal: PAGE_WIDTH * 0.055,
  },
  Title: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: PAGE_HEIGHT * 0.02,
    marginLeft: PAGE_WIDTH * 0.01932367149,
  },
});

export default Header1;
