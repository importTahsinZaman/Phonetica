import { useState, useEffect } from "react";
import "react-native-url-polyfill/auto";

import { DEEPL_KEY, OPEN_AI_API_KEY } from "@env";

import { SafeAreaView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Configuration, OpenAIApi } from "openai";
import * as Speech from "expo-speech";
import ReturnHeader from "../components/ReturnHeader";
import DoubleLanguagePicker from "../components/DoubleLanguagePicker";
import InfoTabs from "../components/InfoTabs";
import TranslateContainer from "../components/TranslateContainer";
import DefineContainer from "../components/DefineContainer";
import PronounceContainer from "../components/PronounceContainer";

import { useTargetLangAbbreviationGlobal } from "../components/LanguagePicker";

const TranslationScreen = ({ route, navigation }) => {
  //This whole page only deals with one sentence
  const { sentence } = route.params; //The sentence chosen by the user from OCR results
  const [finalizedText, setFinalizedText] = useState(""); //Holds the fixed sentence (after API call to fix ocr errors)
  const [wordsList, setWordsList] = useState([]); //The finalizedText broken into words for the user to choose from to define
  const [translatedText, setTranslatedText] = useState(""); //translated text
  const [targetLangAbbreviation, setTargetLangAbbreviation] =
    useTargetLangAbbreviationGlobal();
  const [showTranslate, setShowTranslate] = useState(true);
  const [showDefine, setShowDefine] = useState(false);
  const [showPronounce, setShowPronounce] = useState(false);

  const configuration = new Configuration({
    apiKey: OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setShowTranslate(true);
      setShowDefine(false);
      setShowPronounce(false);
      fixText();
    } else {
      setFinalizedText("");
      setTranslatedText("");
    }
  }, [isFocused]);

  useEffect(() => {
    translateText(finalizedText);
  }, [finalizedText, targetLangAbbreviation]);

  const fixText = async () => {
    await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `Go through the text and based on context clues and english convention, fix errors and return your new text: ${sentence}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((result) => {
        let response1 = JSON.parse(result.request._response);
        setFinalizedText(response1.choices[0].text.trimStart());

        const tempWordsList = response1.choices[0].text
          .trimStart()
          .match(/\b(\w+)'?(\w+)?\b/g);
        let tempWordsObjectList: { id: string; word: string }[] = [];

        tempWordsList.forEach((word: string, index: string) => {
          tempWordsObjectList.push({
            id: index.toString(),
            word: word,
          });
        });

        setWordsList(tempWordsObjectList);
      });
  };

  const translateText = async (text: string) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", DEEPL_KEY);

    var formdata = new FormData();
    formdata.append("text", text);
    formdata.append("target_lang", targetLangAbbreviation);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api-free.deepl.com/v2/translate", requestOptions)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        setTranslatedText(result["translations"][0].text);
      })
      .catch((error) => console.log("Deepl API Error", error));
  };

  const givePronunciation = () => {
    Speech.speak(finalizedText, { rate: 0.7 });
  };

  return (
    <SafeAreaView className="bg-white h-screen h-full w-full w-screen">
      <ReturnHeader
        navigation={navigation}
        destination="TextSelect"
        color="black"
        text="Select Sentence"
        showNavBar={false}
      ></ReturnHeader>
      <DoubleLanguagePicker></DoubleLanguagePicker>
      <InfoTabs
        TranslateSelectFunction={() => {
          setShowTranslate(true);
          setShowDefine(false);
          setShowPronounce(false);
        }}
        DefineSelectFunction={() => {
          setShowTranslate(false);
          setShowDefine(true);
          setShowPronounce(false);
        }}
        PronounceSelectFunction={() => {
          setShowTranslate(false);
          setShowDefine(false);
          setShowPronounce(true);
        }}
        TranslateSelected={showTranslate}
        DefineSelected={showDefine}
        PronounceSelected={showPronounce}
      ></InfoTabs>

      {showTranslate && (
        <TranslateContainer
          EnglishText={finalizedText}
          ForeignText={translatedText}
          SpeakerFunction={() => {
            setShowTranslate(false);
            setShowDefine(false);
            setShowPronounce(true);
          }}
        ></TranslateContainer>
      )}
      {showDefine && (
        <DefineContainer
          wordsList={wordsList}
          text={finalizedText}
          openai={openai}
        ></DefineContainer>
      )}
      {showPronounce && <PronounceContainer></PronounceContainer>}
    </SafeAreaView>
  );
};

export default TranslationScreen;
