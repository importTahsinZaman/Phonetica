import { View, StyleSheet } from "react-native";
import LanguagePicker from "./LanguagePicker";
import CustomText from "./CustomText";

const Header1 = ({}) => {
  return (
    <View className="bg-white flex-row space" style={styles.test}>
      <CustomText className="text-lg">Phonetica</CustomText>
      <LanguagePicker></LanguagePicker>
    </View>
  );
};

const styles = StyleSheet.create({
  test: {
    justifyContent: "space-between",
  },
});

export default Header1;
