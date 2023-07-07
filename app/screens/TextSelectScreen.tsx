import { useState, useEffect } from "react";

import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Button,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import { OCR_SPACE_API_KEY } from "@env";
import ReturnHeader from "../components/ReturnHeader";

import { useIsFocused } from "@react-navigation/native";
import CustomText from "../components/CustomText";

import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonComponent from "../components/SkeletonComponent";
import { FlatList } from "react-native-gesture-handler";
import { tabBarRef } from "../components/HelperFunctions";

const PAGE_WIDTH = Dimensions.get("window").width;

export default function TextSelectScreen({ route, navigation }) {
  const { ReturnHome, BackNavigation } = route.params;
  const [gettingText, setGettingText] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [formattedText, setFormattedText] = useState<
    | {
        sentence: string;
        index: number;
      }[]
    | null
  >(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [editingText, setEditingText] = useState(false);
  const [editedText, setEditedText] = useState("");

  const isFocused = useIsFocused();

  useEffect(() => {
    setOcrText("");
    if (isFocused) {
      tabBarRef?.current?.setVisible(false);
      if (ReturnHome || BackNavigation) {
        getSavedOcrText();
      } else {
        const { base64 } = route.params;
        getOcrText(base64);
      }
    } else {
      setSelectedTextIndex(0);
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

  const updateRecentScanStorage = async (newMostRecentScan: string) => {
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
      ["RecentScan0", newMostRecentScan],
      ["RecentScan1", oldSavedScans[0][1] == null ? "" : oldSavedScans[0][1]],
      ["RecentScan2", oldSavedScans[1][1] == null ? "" : oldSavedScans[1][1]],
      ["RecentScan3", oldSavedScans[2][1] == null ? "" : oldSavedScans[2][1]],
      ["RecentScan4", oldSavedScans[3][1] == null ? "" : oldSavedScans[3][1]],
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
  };

  const replaceMostRecentScanStorage = async (
    newMostRecentScanText: string
  ) => {
    await AsyncStorage.setItem("RecentScan0", newMostRecentScanText);
  };

  const getOcrText = (base64) => {
    setGettingText(true);
    setFormattedText(null);
    var myHeaders = new Headers();
    myHeaders.append(
      "apikey",
      __DEV__ ? OCR_SPACE_API_KEY : process.env.OCR_SPACE_API_KEY
    );

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

        if (result.ParsedResults[0].ParsedText) {
          try {
            updateRecentScanStorage(result.ParsedResults[0].ParsedText);
          } catch (e) {
            console.log("Setting new saved scans error: ", e);
          }
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

    function createArrayOfSentences(strings: string | any[]) {
      var result = [];

      for (var i = 0; i < strings.length; i++) {
        var obj = {
          sentence: strings[i],
          index: i,
        };

        result.push(obj);
      }

      return result;
    }

    setFormattedText(createArrayOfSentences(textArray));
  };

  type ItemProps = { sentence: string; onPress: () => void; selected: boolean };

  const SentenceItem = ({ sentence, onPress, selected }: ItemProps) => (
    <TouchableOpacity onPress={onPress}>
      <View
        className="my-1 p-2 rounded-lg"
        style={{
          borderColor: selected ? "#FFBF23" : "white",
          borderWidth: selected ? 2 : 0,
          backgroundColor: selected ? "#FFBF2329" : "white",
        }}
      >
        <CustomText className="text-lg text-[#8D8D8D]">{sentence}</CustomText>
      </View>
    </TouchableOpacity>
  );

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
      ></ReturnHeader>
      {formattedText && !gettingText ? (
        <FlatList
          className="mx-4"
          data={formattedText}
          renderItem={({ item }) => (
            <SentenceItem
              sentence={item.sentence}
              onPress={() => setSelectedTextIndex(item.index)}
              selected={item.index === selectedTextIndex}
            />
          )}
          keyExtractor={(item) => item.index.toString()}
          extraData={[selectedTextIndex, formattedText]}
        ></FlatList>
      ) : (
        <View className="mx-4">
          <SkeletonComponent
            marginHorizontal={2}
            count={15}
            width={PAGE_WIDTH * 0.91545893719}
          />
        </View>
      )}

      {formattedText && !gettingText && (
        <View className="flex flex-row w-full justify-around">
          <Button
            title="Edit"
            color="#FFBF23"
            onPress={() => {
              if (formattedText[selectedTextIndex].sentence) {
                setEditedText(formattedText[selectedTextIndex].sentence);
                setEditingText(true);
              }
            }}
          />
          <Button
            title="Next"
            color="#FFBF23"
            onPress={() => {
              if (formattedText[selectedTextIndex].sentence) {
                navigation.navigate("Translation", {
                  sentence: formattedText[selectedTextIndex].sentence,
                  ReturnHome: ReturnHome,
                });
              }
            }}
          />
        </View>
      )}

      {formattedText && !gettingText && editingText && (
        <Modal
          visible={editingText}
          transparent={false}
          onRequestClose={() => setEditingText(false)}
          animationType="slide"
        >
          <KeyboardAvoidingView
            className="flex justify-center items-center h-full w-full"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              className="bg-[#F6F6F6] rounded-xl p-4 my-4 min-h-[31vh] max-h-[31vh] min-w-[92vw]"
              style={{ marginHorizontal: PAGE_WIDTH * 0.05333333333 }}
            >
              <View className="flex flex-row justify-between items-center mb-2">
                <CustomText className="text-[#8D8D8D] ">Editing...</CustomText>
              </View>
              <TextInput
                autoFocus={true}
                selectionColor="#FFBF23"
                style={{
                  fontSize: 16,
                  borderBottomWidth: 0,
                  borderBottomColor: "#FFBF23",
                  height: "100%",
                }}
                editable
                multiline
                defaultValue={formattedText[selectedTextIndex].sentence}
                maxLength={200}
                onChangeText={(newText) => setEditedText(newText)}
              ></TextInput>
            </View>
            <Button
              title="Done"
              color="#FFBF23"
              onPress={() => {
                let newFormattedText = formattedText;
                newFormattedText[selectedTextIndex].sentence = editedText;

                let fullText = "";
                for (let i = 0; i < newFormattedText.length; i++) {
                  const sentence = newFormattedText[i].sentence;
                  fullText += sentence + " ";
                }

                replaceMostRecentScanStorage(fullText);
                setFormattedText(newFormattedText);
                setEditingText(false);
              }}
            ></Button>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </SafeAreaView>
  );
}
