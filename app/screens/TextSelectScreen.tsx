import { useState, useEffect } from "react";

import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";

import { OCR_SPACE_API_KEY } from "@env";
import ReturnHeader from "../components/ReturnHeader";

import { useIsFocused } from "@react-navigation/native";
import CustomText from "../components/CustomText";

import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonComponent from "../components/SkeletonComponent";

const PAGE_WIDTH = Dimensions.get("window").width;

export default function TextSelectScreen({ route, navigation }) {
  const { ReturnHome, BackNavigation } = route.params;
  const [gettingText, setGettingText] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [formattedText, setFormattedText] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    setOcrText("");
    if (isFocused) {
      if (ReturnHome || BackNavigation) {
        getSavedOcrText();
      } else {
        const { base64 } = route.params;
        getOcrText(base64);
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
      setGettingText(true);
      await AsyncStorage.getItem("RecentScan0").then((value) => {
        setGettingText(false);
        if (value !== null) {
          setOcrText(value);
          formatText();
        } else {
          setOcrText("ERROR PLEASE RESTART!");
        }
      });
    } catch (e) {
      console.log("GET SAVED OCR TEXT ERROR:" + e);
    }
  };

  const getOcrText = (base64) => {
    setGettingText(true);
    setFormattedText(null);
    var myHeaders = new Headers();
    myHeaders.append("apikey", OCR_SPACE_API_KEY);

    var formdata = new FormData();
    formdata.append("language", "eng");
    formdata.append("isOverlayRequired", "false");
    formdata.append("base64image", `data:image/jpeg;base64,${base64}`);
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

        setGettingText(false);

        try {
          let oldSavedScans = [];
          let newSavedScans = [];

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

          ///////////////////////////////////

          const d = new Date();
          const date = d.toLocaleDateString();
          let time = d.toLocaleTimeString();
          time = time.slice(0, 4) + time.slice(7);

          let oldSavedScanTimes = [];
          let newSavedScanTimes = [];

          oldSavedScanTimes = await AsyncStorage.multiGet([
            "RecentScanTime0",
            "RecentScanTime1",
            "RecentScanTime2",
            "RecentScanTime3",
            "RecentScanTime4",
          ]);

          newSavedScanTimes = [
            ["RecentScanTime0", date + "&$&" + time],
            [
              "RecentScanTime1",
              oldSavedScanTimes[0][1] == null ? "" : oldSavedScanTimes[0][1],
            ],
            [
              "RecentScanTime2",
              oldSavedScanTimes[1][1] == null ? "" : oldSavedScanTimes[1][1],
            ],
            [
              "RecentScanTime3",
              oldSavedScanTimes[2][1] == null ? "" : oldSavedScanTimes[2][1],
            ],
            [
              "RecentScanTime4",
              oldSavedScanTimes[3][1] == null ? "" : oldSavedScanTimes[3][1],
            ],
          ];

          await AsyncStorage.multiSet([
            newSavedScanTimes[0],
            newSavedScanTimes[1],
            newSavedScanTimes[2],
            newSavedScanTimes[3],
            newSavedScanTimes[4],
          ]);
        } catch (e) {
          console.log("Setting new saved scans error: ", e);
        }
      })
      .catch((error) => console.log("Setting new saved scans error2:", error));
  };

  const formatText = () => {
    let preText = ocrText;
    preText = preText.replace(/(\r\n|\n|\r)/gm, " ");
    let textArray = preText
      .replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|")
      .split("|");
    setFormattedText(textArray);
  };

  return (
    <SafeAreaView
      className="bg-white h-screen h-full w-full w-screen"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ReturnHeader
        navigation={navigation}
        color="black"
        text={ReturnHome ? "Home" : "Scan Text"}
        destination={ReturnHome ? "Home" : "Scan"}
        showNavBar={ReturnHome ? true : false}
      ></ReturnHeader>
      <ScrollView className=" mx-4 ">
        {formattedText && !gettingText ? (
          formattedText.map((sentence, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Translation", {
                    sentence: sentence,
                    ReturnHome: ReturnHome,
                  })
                }
                className=" p-2 my-1 rounded-lg"
              >
                <CustomText className="text-lg text-[#8D8D8D]">
                  {sentence}
                </CustomText>
              </TouchableOpacity>
            );
          })
        ) : (
          <SkeletonComponent
            marginHorizontal={2}
            count={15}
            width={PAGE_WIDTH * 0.91545893719}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
