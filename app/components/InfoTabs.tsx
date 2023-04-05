import { TouchableOpacity, View, Pressable } from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";

const InfoTabs = ({
  TranslateSelectFunction = () => console.log("pressed translate"),
  DefineSelectFunction = () => console.log("pressed define"),
  PronounceSelectFunction = () => console.log("pressed pronounce"),
}) => {
  return (
    <View className="flex flex-row  justify-between items-center mx-5">
      <View className={`border-red-400 border-b-4`}>
        <Pressable onPress={TranslateSelectFunction}>
          <CustomText>Translate</CustomText>
        </Pressable>
      </View>
      <View className={`border-red-400 border-b-4`}>
        <Pressable onPress={DefineSelectFunction}>
          <CustomText>Define</CustomText>
        </Pressable>
      </View>
      <View className={`border-red-400 border-b-4`}>
        <Pressable onPress={PronounceSelectFunction}>
          <CustomText>Pronounce</CustomText>
        </Pressable>
      </View>
    </View>
  );
};

export default InfoTabs;
