import { View, StyleSheet } from "react-native";
import LanguagePicker from "./LanguagePicker";
import DoubleArrow from "../assets/DoubleArrow.svg";

const DoubleLanguagePicker = () => {
  const styles = StyleSheet.create({
    Container: {
      justifyContent: "space-between",
      alignItems: "center",
    },
  });

  return (
    <View
      style={styles.Container}
      className="flex flex-row bg-[#FFBF23] rounded-xl mx-8 space px-2 py-1"
    >
      <LanguagePicker></LanguagePicker>
      <DoubleArrow></DoubleArrow>
      <LanguagePicker></LanguagePicker>
    </View>
  );
};

export default DoubleLanguagePicker;
