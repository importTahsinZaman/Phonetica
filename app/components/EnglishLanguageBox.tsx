import { View } from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";

const InfoTabs = () => {
  return (
    <View>
      <View>
        <CustomText></CustomText>
        <SpeakerIcon></SpeakerIcon>
      </View>
      <CustomText></CustomText>
    </View>
  );
};

export default InfoTabs;
