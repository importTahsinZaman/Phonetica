import { View, Dimensions } from "react-native";
import CustomText from "./CustomText";
import { ScrollView } from "react-native-gesture-handler";

import { useTargetLangStringGlobal } from "./LanguagePicker";
import SkeletonComponent from "./SkeletonComponent";

const PAGE_WIDTH = Dimensions.get("window").width;

const ForeignLanguageBox = ({
  ForeignText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
}) => {
  const [targetLangString, setTargetLangString] = useTargetLangStringGlobal();

  return (
    <View
      className="bg-[#F6F6F6] rounded-xl p-4 my-4 h-[31vh]"
      style={{ marginHorizontal: PAGE_WIDTH * 0.05333333333 }}
    >
      <View className="flex flex-row justify-between items-center">
        <CustomText className="text-[#8D8D8D] ">{targetLangString}</CustomText>
      </View>

      <ScrollView>
        {ForeignText ? (
          <CustomText className="mt-2 text-base">{ForeignText}</CustomText>
        ) : (
          <SkeletonComponent marginTop={5} width={PAGE_WIDTH - 78} />
        )}
      </ScrollView>
    </View>
  );
};

export default ForeignLanguageBox;
