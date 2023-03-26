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
  const { sentence } = route.params;
  const [finalizedText, setFinalizedText] = useState("");
  const [wordsList, setWordsList] = useState([]);
  const [translatedText, setTranslatedText] = useState("");
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

  const generateDefinitionExplanation = async (word: string) => {
    await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `Explain the definition and usage of the word "${word}" in this context to someone who only speaks Spanish. Keep the word in English and within quotation marks whenever referring to it.`,
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
    Speech.speak(sentence, { rate: 0.5 });
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
          {wordsList.map((word) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  generateDefinitionExplanation(word);
                }}
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
