import { useState, useEffect } from "react";

import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { OCR_SPACE_API_KEY, OPEN_AI_API_KEY, DEEPL_KEY } from "@env";
import ReturnHeader from "../components/ReturnHeader";

import { useIsFocused } from "@react-navigation/native";
import CustomText from "../components/CustomText";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TextSelectScreen({ route, navigation }) {
  const [ocrText, setOcrText] = useState("");
  const [formattedText, setFormattedText] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("got focus");
      try {
        const { height, uri, width, base64 } = route.params;
        getOcrText(base64);
      } catch (e) {
        getSavedOcrText();
      }
    } else {
      setFormattedText(null);
    }
  }, [isFocused]);

  useEffect(() => {
    formatText();
  }, [ocrText]);

  const getSavedOcrText = async () => {
    try {
      await AsyncStorage.getItem("most_recent_ocr_text").then((value) => {
        if (value !== null) {
          console.log("SETTING OCR TEXT WITH STORAGE RETRIEVED VALUES!");
          setOcrText(value);
          formatText();
        } else {
          setOcrText("!ERROR PLEASE RESTART!");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getOcrText = (base64) => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", OCR_SPACE_API_KEY);

    var formdata = new FormData();
    formdata.append("language", "eng");
    formdata.append("isOverlayRequired", "false");
    formdata.append("base64image", `data:image/jpg;base64,${base64}`);
    formdata.append("iscreatesearchablepdf", "false");
    formdata.append("issearchablepdfhidetextlayer", "false");
    formdata.append("detectOrientation", "true");
    formdata.append("scale", "true");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.ocr.space/parse/image", requestOptions)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then(async (result) => {
        setOcrText(result.ParsedResults[0].ParsedText);

        try {
          await AsyncStorage.setItem(
            "most_recent_ocr_text",
            result.ParsedResults[0].ParsedText
          );
        } catch (e) {
          // saving error
        }
      })
      .catch((error) => console.log("error", error));
  };

  const formatText = () => {
    let preText = ocrText;
    preText = preText.replace(/(\r\n|\n|\r)/gm, " ");
    let textArray = preText.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
    setFormattedText(textArray);
  };

  return (
    <SafeAreaView className="bg-white h-screen h-full w-full w-screen">
      <ReturnHeader
        navigation={navigation}
        color="black"
        text="Scan Text"
        destination="Scan"
        showNavBar={false}
      ></ReturnHeader>
      <ScrollView>
        {formattedText &&
          formattedText.map((sentence, index) => {
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Translation", { sentence: sentence })
                  }
                  className="border-black border-b-2"
                >
                  <CustomText className="text-lg">{sentence}</CustomText>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
