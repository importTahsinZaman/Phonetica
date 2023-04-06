import { View, StyleSheet, Dimensions } from "react-native";
import LanguagePicker from "./LanguagePicker";
import DoubleArrow from "../assets/DoubleArrow.svg";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const DoubleLanguagePicker = () => {
  const styles = StyleSheet.create({
    Container: {
      marginHorizontal: PAGE_WIDTH * 0.05333333333,
    },
  });

  return (
    <View
      style={styles.Container}
      className="flex flex-row bg-[#FFBF23] justify-between items-center rounded-2xl px-6 py-2"
    >
      <LanguagePicker
        disabled={true}
        size={PAGE_WIDTH * 0.07466666666}
        fontSize={15}
      ></LanguagePicker>
      <DoubleArrow
        width={PAGE_WIDTH * 0.05333333333}
        height={PAGE_WIDTH * 0.05333333333}
      ></DoubleArrow>
      <LanguagePicker
        size={PAGE_WIDTH * 0.07466666666}
        fontSize={15}
      ></LanguagePicker>
    </View>
  );
};

export default DoubleLanguagePicker;
