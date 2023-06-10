import { View, Dimensions, ScrollView } from "react-native";
import EnglishLanguageBox from "./EnglishLanguageBox";
import ForeignLanguageBox from "./ForeignLanguageBox";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const TranslateContainer = ({
  EnglishText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
  ForeignText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
}) => {
  if (PAGE_HEIGHT < 700) {
    return (
      <ScrollView>
        <EnglishLanguageBox EnglishText={EnglishText}></EnglishLanguageBox>
        <ForeignLanguageBox ForeignText={ForeignText}></ForeignLanguageBox>
      </ScrollView>
    );
  } else {
    return (
      <View>
        <EnglishLanguageBox EnglishText={EnglishText}></EnglishLanguageBox>
        <ForeignLanguageBox ForeignText={ForeignText}></ForeignLanguageBox>
      </View>
    );
  }
};

export default TranslateContainer;
