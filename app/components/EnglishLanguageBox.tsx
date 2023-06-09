import { View, Pressable, Dimensions } from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";
import { ScrollView } from "react-native-gesture-handler";
import SkeletonComponent from "./SkeletonComponent";

const PAGE_WIDTH = Dimensions.get("window").width;

const EnglishLanguageBox = ({
  EnglishText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
}) => {
  return (
    <View
      className="bg-[#F6F6F6] rounded-xl p-4 my-4 h-[31vh]"
      style={{ marginHorizontal: PAGE_WIDTH * 0.05333333333 }}
    >
      <View className="flex flex-row justify-between items-center">
        <CustomText className="text-[#8D8D8D] ">English (US)</CustomText>
      </View>

      <ScrollView>
        {EnglishText ? (
          <CustomText className="mt-2 text-base">{EnglishText}</CustomText>
        ) : (
          <SkeletonComponent marginTop={5} />
        )}
      </ScrollView>
    </View>
  );
};

export default EnglishLanguageBox;
