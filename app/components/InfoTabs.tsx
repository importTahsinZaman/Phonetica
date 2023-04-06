import {
  TouchableOpacity,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";

type Props = {
  TranslateSelectFunction: () => void;
  DefineSelectFunction: () => void;
  PronounceSelectFunction: () => void;
  TranslateSelected: boolean;
  DefineSelected: boolean;
  PronounceSelected: boolean;
};

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const InfoTabs: React.FC<Props> = ({
  TranslateSelectFunction,
  DefineSelectFunction,
  PronounceSelectFunction,
  TranslateSelected,
  DefineSelected,
  PronounceSelected,
}) => {
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: PAGE_WIDTH * 0.05333333333,
      marginBottom: 4,
    },
    tab: {
      borderColor: "#D9D9D9",
      borderBottomWidth: 4,
      flexGrow: 1,
      padding: 12,
    },
    selectedTab: {
      borderColor: "#FFBF23",
      borderBottomWidth: 4,
      flexGrow: 1,
      padding: 12,
    },
    pressable: {
      display: "flex",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 16,
      color: "#8D8D8D",
    },
    selectedText: {
      fontSize: 16,
      color: "#FFBF23",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={TranslateSelected ? styles.selectedTab : styles.tab}
        onPressIn={TranslateSelectFunction}
      >
        <View style={styles.pressable}>
          <CustomText
            style={TranslateSelected ? styles.selectedText : styles.text}
            fontThicknessNumber={TranslateSelected ? 4 : 3}
          >
            Translate
          </CustomText>
        </View>
      </Pressable>
      <Pressable
        style={DefineSelected ? styles.selectedTab : styles.tab}
        onPressIn={DefineSelectFunction}
      >
        <View style={styles.pressable}>
          <CustomText
            style={DefineSelected ? styles.selectedText : styles.text}
            fontThicknessNumber={DefineSelected ? 4 : 3}
          >
            Define
          </CustomText>
        </View>
      </Pressable>
      <Pressable
        style={PronounceSelected ? styles.selectedTab : styles.tab}
        onPressIn={PronounceSelectFunction}
      >
        <View style={styles.pressable}>
          <CustomText
            style={PronounceSelected ? styles.selectedText : styles.text}
            fontThicknessNumber={PronounceSelected ? 4 : 3}
          >
            Pronounce
          </CustomText>
        </View>
      </Pressable>
    </View>
  );
};

export default InfoTabs;
