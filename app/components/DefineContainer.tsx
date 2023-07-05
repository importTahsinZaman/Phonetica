import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { DEEPL_KEY, NLP_API_KEY } from "@env";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";
import { ScrollView } from "react-native-gesture-handler";
import * as Speech from "expo-speech";
import SkeletonComponent from "./SkeletonComponent";
import SkeletonComponent2 from "./SkeletonComponent2";
import { useTargetLangAbbreviationGlobal } from "../components/LanguagePicker";
import Constants, { ExecutionEnvironment } from "expo-constants";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const PAGE_WIDTH = Dimensions.get("window").width;

type ComponentProps = {
  wordsList: ItemData[];
  text: string;
  openai: any; //TODO: FIX THIS!
};

type ItemData = {
  id: string; //ID MUST BE THE WORD'S INDEX
  word: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  borderColor: string;
};

const Item = ({ item, onPress, backgroundColor, borderColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{ backgroundColor, borderColor }]}
    className={`p-[10] my-1 mx-2 rounded-lg border-2 `}
  >
    <Text style={[{}]} className="text-base">
      {item.word}
    </Text>
  </TouchableOpacity>
);

const DefineContainer: React.FC<ComponentProps> = ({
  wordsList,
  text,
  openai,
}) => {
  const [selectedId, setSelectedId] = useState<string>();
  const [definitionExplanation, setDefinitionExplanation] = useState("");
  const [englishDefinitionExplanation, setEnglishDefinitionExplanation] =
    useState("");
  //These exist for recall of definition method when user changes language so they don't have to click a different word and then back to their word to get definition in a different language
  const [currentWordChosenForDefinition, setCurrentWordChosenForDefinition] =
    useState("");
  const [
    currentInstanceChosenForDefinition,
    setCurrentInstanceChosenForDefinition,
  ] = useState("");
  const [waitingForExplanationAPIResult, setWaitingForExplanationAPIResult] =
    useState(false);
  const [targetLangAbbreviation, setTargetLangAbbreviation] =
    useTargetLangAbbreviationGlobal();
  const [addFlashcardEnabled, setAddFlashcardEnabled] = useState(false);

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.id === selectedId ? "#FFBF23" : "#ffffff";
    const borderColor = item.id === selectedId ? "#FFBF23" : "#8D8D8D30";

    return (
      <Item
        item={item}
        onPress={() => {
          if (item.id !== selectedId && !waitingForExplanationAPIResult) {
            setDefinitionExplanation("");
            setSelectedId(item.id);

            let instanceArray = [];
            let instanceCount = 1;
            //Grab all the words in the sentence that are the same as the chosen word as well as the # instance of the that word they are in the sentence
            for (let j = 0; j < wordsList.length; j++) {
              if (wordsList[j].word === item.word) {
                instanceArray.push({
                  instance: instanceCount,
                  arrayIndex: j,
                });
                instanceCount++;
              }
            }
            let pickedInstance: { instance: number; arrayIndex: number } = {};
            //Figure out the instance of my exact word by cross referencing my chosen word's array index with the other words' array indexes
            instanceArray.forEach((instance) => {
              if (instance.arrayIndex.toString() == item.id) {
                //ID MUST BE THE WORD'S INDEX FOR THIS TO WORK
                pickedInstance = instance;
              }
            });

            setCurrentWordChosenForDefinition(item.word);
            setCurrentInstanceChosenForDefinition(
              pickedInstance.instance.toString()
            );

            generateDefinitionExplanation(
              item.word,
              pickedInstance.instance.toString()
            );
          }
        }}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
      />
    );
  };

  const generateDefinitionExplanation = async (
    word: string,
    instance: string
  ) => {
    const prompt = `Explain, the definition and usage of occurrence ${
      instance ? instance : 1
    } of the word "${word}" in the context of this text: "${text}". Keep the word within quotation marks whenever referring to it. If the word is not a valid English word or makes no sense within the context of the given text, return 'invalid scan'`;

    if (isExpoGo) {
      console.log("Prompt: " + prompt);
    }

    setWaitingForExplanationAPIResult(true);
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
      .then(async (result) => {
        const response1 = JSON.parse(result.request._response);
        const englishExplanation = response1.choices[0].text.trimStart();
        setEnglishDefinitionExplanation(englishExplanation);

        if (isExpoGo) {
          console.log("English Explanation: ", englishExplanation);
        }

        if (targetLangAbbreviation === "bn") {
          const url = `https://nlp-translation.p.rapidapi.com/v1/translate?text=${englishExplanation}&to=bn&from=en&protected_words=${word}`;
          const options = {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": NLP_API_KEY,
              "X-RapidAPI-Host": "nlp-translation.p.rapidapi.com",
            },
          };

          try {
            const response = await fetch(url, options);
            let result = await response.text();
            result = JSON.parse(result);
            setDefinitionExplanation(result["translated_text"]["bn"]);
          } catch (error) {
            console.log("NLP API ERROR: ", error);
          }
        } else if (targetLangAbbreviation != "EN-US") {
          function addKeepTags(sentence: string, word: string) {
            // Create a regular expression with word boundaries
            var regex = new RegExp("\\b" + word + "\\b", "gi");

            // Replace the word with the word wrapped in keep tags
            var result = sentence.replace(regex, "<keep>$&</keep>");

            return result;
          }

          function removeKeepTags(sentence) {
            var regex = /<keep>(.*?)<\/keep>/gi;
            var result = sentence.replace(regex, "$1");
            return result;
          }

          let queryText = addKeepTags(englishExplanation, word);

          var myHeaders = new Headers();
          myHeaders.append("Authorization", DEEPL_KEY);

          var formdata = new FormData();
          formdata.append("text", queryText);
          formdata.append("target_lang", targetLangAbbreviation);
          formdata.append("tag_handling", "xml");
          formdata.append("ignore_tags", "keep");

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
              let final = result["translations"][0].text;

              setDefinitionExplanation(removeKeepTags(final));
            })
            .catch((error) =>
              console.log("Deepl API Error in Define Container", error)
            );
        } else {
          setDefinitionExplanation(englishExplanation);
        }
        setWaitingForExplanationAPIResult(false);
      });
  };

  const addFlashcard = async () => {
    try {
      const flashcardStringJSON = await AsyncStorage.getItem("Flashcards");
      let flashcardJSON = JSON.parse(flashcardStringJSON);

      flashcardJSON.unshift({
        word:
          currentWordChosenForDefinition.charAt(0).toUpperCase() +
          currentWordChosenForDefinition.slice(1),
        instanceNumber: currentInstanceChosenForDefinition,
        text: text,
        definition: definitionExplanation,
        englishDefinition: englishDefinitionExplanation,
        feeling: 3,
      });

      await AsyncStorage.setItem("Flashcards", JSON.stringify(flashcardJSON));

      Toast.show({
        type: "success",
        text1: "Successfully added flashcard! 🤩",
        text2:
          "Created new flashcard for '" + currentWordChosenForDefinition + "'",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Unable to add flashcard 🙁",
        text2:
          "Unable to create new flashcard for '" +
          currentWordChosenForDefinition +
          "'",
      });
    }
  };

  useEffect(() => {
    if (
      currentInstanceChosenForDefinition !== "" &&
      currentWordChosenForDefinition !== ""
    ) {
      generateDefinitionExplanation(
        currentWordChosenForDefinition,
        currentInstanceChosenForDefinition
      );
    }
  }, [targetLangAbbreviation]);

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;

    if (!addFlashcardEnabled) {
      timeoutId = setTimeout(() => {
        setAddFlashcardEnabled(true);
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [addFlashcardEnabled]);

  return (
    <SafeAreaView className="my-4 w-full grow flex">
      <SafeAreaView style={styles.wordsContainer} className=" max-h-[28%]">
        <FlatList
          className="m-0 p-0"
          data={wordsList}
          numColumns={100}
          columnWrapperStyle={{ flexWrap: "wrap" }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
      </SafeAreaView>

      <SafeAreaView
        style={styles.containerMargin}
        className="h-[35%] max-h-[35%]"
      >
        {definitionExplanation && !waitingForExplanationAPIResult && (
          <SafeAreaView
            className="flex flex-row mt-4"
            style={styles.defineText}
          >
            <Pressable
              onPress={() => {
                Speech.speak(wordsList[parseInt(selectedId)].word, {
                  rate: 0.8,
                  voice: "com.apple.ttsbundle.siri_Aaron_en-US_compact",
                });
              }}
            >
              <SpeakerIcon></SpeakerIcon>
            </Pressable>

            <SafeAreaView className="ml-2">
              <CustomText className="text-xl">
                '
                {wordsList[parseInt(selectedId)].word.charAt(0).toUpperCase() +
                  wordsList[parseInt(selectedId)].word.slice(1)}
                '
              </CustomText>
              <ScrollView className="py-1">
                <CustomText className="text-[#8D8D8D] text-base">
                  {definitionExplanation}
                </CustomText>
              </ScrollView>
              {englishDefinitionExplanation &&
                targetLangAbbreviation != "EN-US" && (
                  <ScrollView className="py-1">
                    <CustomText className="text-[#8D8D8D] text-base">
                      {englishDefinitionExplanation}
                    </CustomText>
                  </ScrollView>
                )}
            </SafeAreaView>
          </SafeAreaView>
        )}
        {waitingForExplanationAPIResult && (
          <SafeAreaView
            className="flex flex-row mt-4"
            style={styles.defineText}
          >
            <SkeletonComponent2 />
            <SafeAreaView className="mx-2">
              <SkeletonComponent count={1} width={0.169082125 * PAGE_WIDTH} />
              <SkeletonComponent
                count={targetLangAbbreviation != "EN-US" ? 3 : 4}
                marginTop={5}
                width={PAGE_WIDTH * 0.7729468599}
              />
              {targetLangAbbreviation != "EN-US" && (
                <SkeletonComponent
                  count={3}
                  marginTop={15}
                  width={PAGE_WIDTH * 0.7729468599}
                />
              )}
            </SafeAreaView>
          </SafeAreaView>
        )}
      </SafeAreaView>

      {definitionExplanation && !waitingForExplanationAPIResult && (
        <SafeAreaView style={styles.containerMargin} className="mt-auto">
          <TouchableOpacity
            disabled={!addFlashcardEnabled}
            onPress={() => {
              if (addFlashcardEnabled) {
                addFlashcard();
                setAddFlashcardEnabled(false);
              }
            }}
            style={{
              backgroundColor: "#FFBF23",
              opacity: addFlashcardEnabled ? 1 : 0.75,
            }}
            className="p-3 rounded-lg items-center justify-center transition-none transform-none"
          >
            <CustomText>Create Flashcard</CustomText>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wordsContainer: { marginHorizontal: PAGE_WIDTH * 0.02988 },
  containerMargin: {
    marginHorizontal: PAGE_WIDTH * 0.0583333333333333333,
  },
  defineText: {
    marginRight: PAGE_WIDTH * 0.0699998,
  },
});

export default DefineContainer;
