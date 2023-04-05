import { View, Pressable } from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";
import { ScrollView } from "react-native-gesture-handler";

const EnglishLanguageBox = ({
  EnglishText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
  SpeakerFunction = () => console.log("English Speaker Pressed"),
}) => {
  return (
    <View className="bg-[#F6F6F6] rounded-xl p-4 m-4 h-[31vh]">
      <View className="flex flex-row justify-between items-center">
        <CustomText className="text-[#8D8D8D] ">English (US)</CustomText>
        <Pressable onPress={SpeakerFunction}>
          <SpeakerIcon></SpeakerIcon>
        </Pressable>
      </View>
      <ScrollView>
        <CustomText className="mt-2 text-base">{EnglishText}</CustomText>
      </ScrollView>
    </View>
  );
};

export default EnglishLanguageBox;
