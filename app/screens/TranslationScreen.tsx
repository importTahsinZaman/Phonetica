import { useState, useEffect } from "react";

import { DEEPL_KEY, OPEN_AI_API_KEY } from "@env";

import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Configuration, OpenAIApi } from "openai";

const TranslationScreen = ({ route, navigation }) => {
  const [finalizedText, setFinalizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const { sentence } = route.params;

  const fixText = async () => {
    console.log("Running fix text");
    const configuration = new Configuration({
      apiKey: OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

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
        console.log(response1.choices[0].text.trimStart());
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

  useEffect(() => {
    console.log("Running useEffect for fixing Text");
    fixText();
  }, []);

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          translateText(finalizedText);
        }}
      >
        <Text>{finalizedText}</Text>
      </TouchableOpacity>
      <Text></Text>
      <Text>{translatedText}</Text>
    </SafeAreaView>
  );
};

export default TranslationScreen;
