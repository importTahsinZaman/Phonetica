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

export default function OCRScreen({ route, navigation }) {
  const { height, uri, width, base64 } = route.params;
  const [ocrText, setOcrText] = useState("");
  const [formattedText, setFormattedText] = useState(null);

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

  useEffect(() => {
    console.log("Running Initial useEffect");
    getOcrText();
  }, []);

  useEffect(() => {
    console.log("Running useEffect for Formatting Text");
    formatText();
  }, [ocrText]);

  const styles = StyleSheet.create({
    setFontSize30: {
      fontSize: 30,
    },
  });

  return (
    <SafeAreaView>
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
                  <Text style={styles.setFontSize30}>{sentence}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
