import { View, StyleSheet } from "react-native";
import LanguagePicker from "./LanguagePicker";
import DoubleArrow from "../assets/DoubleArrow.svg";

const DoubleLanguagePicker = () => {
  return (
    <View className="flex flex-row bg-[#FFBF23] justify-between items-center rounded-xl space px-2 py-1 mx-5">
      <LanguagePicker disabled={true}></LanguagePicker>
      <DoubleArrow></DoubleArrow>
      <LanguagePicker></LanguagePicker>
    </View>
  );
};

export default DoubleLanguagePicker;
