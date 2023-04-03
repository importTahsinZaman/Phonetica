import { View } from "react-native";
import LanguagePicker from "./LanguagePicker";
import CustomText from "./CustomText";

const Header1 = ({}) => {
  return (
    <View className="bg-white">
      <CustomText
        style={{ fontFamily: "SpaceGrotesk_700Bold" }}
        className="text-lg"
      >
        Phonetica
      </CustomText>
      <LanguagePicker></LanguagePicker>
    </View>
  );
};

export default Header1;
