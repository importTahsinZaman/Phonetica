import { TouchableOpacity, View, Pressable, StyleSheet } from "react-native";
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
      marginHorizontal: 20,
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
      <View style={TranslateSelected ? styles.selectedTab : styles.tab}>
        <Pressable style={styles.pressable} onPressIn={TranslateSelectFunction}>
          <CustomText
            style={TranslateSelected ? styles.selectedText : styles.text}
          >
            Translate
          </CustomText>
        </Pressable>
      </View>
      <View style={DefineSelected ? styles.selectedTab : styles.tab}>
        <Pressable style={styles.pressable} onPressIn={DefineSelectFunction}>
          <CustomText
            style={DefineSelected ? styles.selectedText : styles.text}
          >
            Define
          </CustomText>
        </Pressable>
      </View>
      <View style={PronounceSelected ? styles.selectedTab : styles.tab}>
        <Pressable style={styles.pressable} onPressIn={PronounceSelectFunction}>
          <CustomText
            style={PronounceSelected ? styles.selectedText : styles.text}
          >
            Pronounce
          </CustomText>
        </Pressable>
      </View>
    </View>
  );
};

export default InfoTabs;
