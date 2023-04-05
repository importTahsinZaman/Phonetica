import { View } from "react-native";
import CustomText from "./CustomText";
import EnglishLanguageBox from "./EnglishLanguageBox";
import ForeignLanguageBox from "./ForeignLanguageBox";

const TranslateContainer = ({
  EnglishText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
  ForeignText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
  SpeakerFunction = () => console.log("English Speaker Pressed"),
}) => {
  return (
    <View>
      <EnglishLanguageBox
        EnglishText={EnglishText}
        SpeakerFunction={SpeakerFunction}
      ></EnglishLanguageBox>
      <ForeignLanguageBox ForeignText={ForeignText}></ForeignLanguageBox>
    </View>
  );
};

export default TranslateContainer;
