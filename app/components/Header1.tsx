import { View, StyleSheet, Dimensions } from "react-native";
import LanguagePicker from "./LanguagePicker";
import CustomText from "./CustomText";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const Header1 = ({}) => {
  return (
    <View className="bg-white flex-row justify-between items-center">
      <CustomText style={styles.Title}>Phonetica</CustomText>
      <LanguagePicker></LanguagePicker>
    </View>
  );
};

const styles = StyleSheet.create({
  Title: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: PAGE_HEIGHT * 0.02,
  },
});

export default Header1;
