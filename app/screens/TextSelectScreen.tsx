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

import { OCR_SPACE_API_KEY } from "@env";
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
        //In the instance that user is going backwards into this page, the prop retrieval fails so we grab from async storage:
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
      await AsyncStorage.getItem("RecentScan0").then((value) => {
        if (value !== null) {
          console.log("SETTING OCR TEXT WITH STORAGE RETRIEVED VALUES!");
          setOcrText(value);
          formatText();
        } else {
          setOcrText("ERROR PLEASE RESTART!");
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

        let oldSavedScans = [];
        let newSavedScans = [];

        try {
          oldSavedScans = await AsyncStorage.multiGet([
            "RecentScan0",
            "RecentScan1",
            "RecentScan2",
            "RecentScan3",
            "RecentScan4",
          ]);

          newSavedScans = [
            ["RecentScan0", result.ParsedResults[0].ParsedText],
            [
              "RecentScan1",
              oldSavedScans[0][1] == null ? "" : oldSavedScans[0][1],
            ],
            [
              "RecentScan2",
              oldSavedScans[1][1] == null ? "" : oldSavedScans[1][1],
            ],
            [
              "RecentScan3",
              oldSavedScans[2][1] == null ? "" : oldSavedScans[2][1],
            ],
            [
              "RecentScan4",
              oldSavedScans[3][1] == null ? "" : oldSavedScans[3][1],
            ],
          ];

          await AsyncStorage.multiSet([
            newSavedScans[0],
            newSavedScans[1],
            newSavedScans[2],
            newSavedScans[3],
            newSavedScans[4],
          ]);
        } catch (e) {
          console.log("Setting new saved scans error: ", e);
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
      <ScrollView className=" mx-4 ">
        {formattedText &&
          formattedText.map((sentence, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Translation", { sentence: sentence })
                }
                className=" p-2 my-1 rounded-lg"
              >
                <CustomText className="text-lg text-[#8D8D8D]">
                  {sentence}
                </CustomText>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
