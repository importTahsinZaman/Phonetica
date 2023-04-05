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

export default function TextSelectScreen({ route, navigation }) {
  const { height, uri, width, base64 } = route.params;
  const [ocrText, setOcrText] = useState("");
  const [formattedText, setFormattedText] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("Running Initial useEffect");
      getOcrText();
    } else {
      setFormattedText(null);
    }
  }, [isFocused]);

  useEffect(() => {
    console.log("Running useEffect for Formatting Text");
    formatText();
  }, [ocrText]);

  const getOcrText = () => {
    console.log("Running getOcrText");

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
      // .then((result) => {
      //   console.log(result);
      // })
      .then((result) => JSON.parse(result))
      .then((result) => {
        setOcrText(result.ParsedResults[0].ParsedText);
        console.log(result.ParsedResults[0].ParsedText);
        // translateText();
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
        text="Scan"
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
