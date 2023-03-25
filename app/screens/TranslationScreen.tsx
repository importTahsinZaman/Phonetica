import { DEEPL_KEY } from "@env";

import { SafeAreaView, Text } from "react-native";

const TranslationScreen = ({ route, navigation }) => {
  const { text } = route.params;
  console.log(text);

  const translateText = async () => {
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
        console.log(result["translations"][0].text);
      })
      .catch((error) => console.log("error", error));

    // console.log("Running translateText");
    // const configuration = new Configuration({
    //   apiKey: OPEN_AI_API_KEY,
    // });
    // const openai = new OpenAIApi(configuration);

    // await openai
    //   .createCompletion({
    //     model: "text-curie-001",
    //     prompt: `Translate into Spanish: "${ocrText}"`,
    //     temperature: 0.7,
    //     max_tokens: 256,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0,
    //   })
    //   .then((result) => {
    //     const translated = result.data.choices[0].text;
    //     setTranslatedText(translated);
    //   });
  };
  return (
    <SafeAreaView>
      <Text>{text}</Text>
    </SafeAreaView>
  );
};

export default TranslationScreen;
