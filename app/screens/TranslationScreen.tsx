import { useState, useEffect } from "react";

import { DEEPL_KEY, OPEN_AI_API_KEY } from "@env";

import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Configuration, OpenAIApi } from "openai";
import * as Speech from "expo-speech";

const TranslationScreen = ({ route, navigation }) => {
  //This whole page only deals with one sentence
  const { sentence } = route.params; //The sentence chosen by the user from OCR results
  const [finalizedText, setFinalizedText] = useState(""); //Holds the fixed sentence (after API call to fix ocr errors)
  const [wordsList, setWordsList] = useState([]); //The finalizedText broken into words for the user to choose from to define
  const [translatedText, setTranslatedText] = useState(""); //translated text
  const [definitionModalVisible, setDefinitionModalVisible] = useState(false);
  const [definitionExplanation, setDefinitionExplanation] = useState("");

  const configuration = new Configuration({
    apiKey: OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const fixText = async () => {
    console.log("Running fix text");

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
        setWordsList(response1.choices[0].text.trimStart().match(/\b(\w+)\b/g));
      });
  };

  const translateText = async (text: string) => {
    console.log("Running Translate Text");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", DEEPL_KEY);

    var formdata = new FormData();
    formdata.append("text", text);
    formdata.append("target_lang", "ES");

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
      .catch((error) => console.log("error", error));
  };

  const generateDefinitionExplanation = async (
    word: string,
    instance: number
  ) => {
    const prompt = `Explain, to someone who only speaks Spanish, the definition and usage of occurrence ${instance} of the word "${word}" in the context of this text: "${finalizedText}". Keep the word in English and within quotation marks whenever referring to it.`;
    console.log(prompt);
    await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((result) => {
        let response1 = JSON.parse(result.request._response);
        setDefinitionExplanation(response1.choices[0].text.trimStart());
      });
  };

  const givePronunciation = () => {
    Speech.speak(finalizedText, { rate: 0.7 });
  };

  useEffect(() => {
    console.log("Running useEffect for fixing Text");
    fixText();
  }, []);

  return (
    <SafeAreaView>
      <Text>{finalizedText}</Text>
      <Text></Text>
      <Text>{translatedText}</Text>
      <Text></Text>

      <TouchableOpacity
        onPress={() => {
          translateText(finalizedText);
        }}
        className="items-center"
      >
        <Text className="text-xl font-bold text-black">Translate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setDefinitionModalVisible(true)}
        className="items-center"
      >
        <Text className="text-xl font-bold text-black">Definition</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => givePronunciation()}
        className="items-center"
      >
        <Text className="text-xl font-bold text-black">Pronunciation</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={definitionModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setDefinitionModalVisible(!definitionModalVisible);
        }}
      >
        <SafeAreaView>
          <TouchableOpacity
            className="p-10 bg-[#2196F3]"
            onPress={() => setDefinitionModalVisible(!definitionModalVisible)}
          >
            <Text>Hide Modal</Text>
          </TouchableOpacity>
          <Text>{definitionExplanation}</Text>
          {wordsList.map((word, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  let instanceArray = [];
                  let instanceCount = 1;
                  for (let j = 0; j < wordsList.length; j++) {
                    if (wordsList[j] == word) {
                      instanceArray.push({
                        instance: instanceCount,
                        arrayIndex: j,
                      });
                      instanceCount++;
                    }
                  }
                  console.log(instanceArray);
                  let pickedInstance = {};
                  instanceArray.forEach((instance) => {
                    if (instance.arrayIndex == index) {
                      pickedInstance = instance;
                    }
                  });
                  console.log(pickedInstance);
                  generateDefinitionExplanation(word, pickedInstance.instance);
                }}
                key={index}
              >
                <Text>{word}</Text>
              </TouchableOpacity>
            );
          })}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default TranslationScreen;
