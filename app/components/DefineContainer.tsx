import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";
import { useTargetLangStringGlobal } from "./LanguagePicker";
import { ScrollView } from "react-native-gesture-handler";
import * as Speech from "expo-speech";
import SkeletonComponent from "./SkeletonComponent";
import SkeletonComponent2 from "./SkeletonComponent2";

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
  const [targetLangString, setTargetLangString] = useTargetLangStringGlobal();
  const [selectedId, setSelectedId] = useState<string>();
  const [definitionExplanation, setDefinitionExplanation] = useState("");
  //These exist for recall of definition method when user changes language so they don't have to click a different word and then back to their word to get definition in a different language
  const [currentWordChosenForDefinition, setCurrentWordChosenForDefinition] =
    useState("");
  const [
    currentInstanceChosenForDefinition,
    setCurrentInstanceChosenForDefinition,
  ] = useState("");
  const [waitingForExplanationAPIResult, setWaitingForExplanationAPIResult] =
    useState(false);

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
    const prompt = `Explain, to someone who only speaks ${targetLangString}, the definition and usage of occurrence ${
      instance ? instance : 1
    } of the word "${word}" in the context of this text: "${text}". Keep the word in English and within quotation marks whenever referring to it.`;
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
      .then((result) => {
        let response1 = JSON.parse(result.request._response);
        setDefinitionExplanation(response1.choices[0].text.trimStart());
        setWaitingForExplanationAPIResult(false);
      });
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
  }, [targetLangString]);

  return (
    <SafeAreaView className="my-4 w-full grow flex">
      <SafeAreaView style={styles.wordsContainer} className=" max-h-[36.5%]">
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
        {definitionExplanation && !waitingForExplanationAPIResult ? (
          <SafeAreaView
            className="flex flex-row mt-4"
            style={styles.defineText}
          >
            <Pressable
              onPress={() => {
                Speech.speak(wordsList[parseInt(selectedId)].word, {
                  rate: 0.8,
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
            </SafeAreaView>
          </SafeAreaView>
        ) : (
          <SafeAreaView
            className="flex flex-row mt-4"
            style={styles.defineText}
          >
            <SkeletonComponent2 />
            <SafeAreaView className="mx-2">
              <SkeletonComponent count={1} width={70} />
              <SkeletonComponent
                count={4}
                marginTop={5}
                width={PAGE_WIDTH - 94}
              />
            </SafeAreaView>
          </SafeAreaView>
        )}
      </SafeAreaView>

      {definitionExplanation && (
        <SafeAreaView style={styles.containerMargin} className="mt-auto">
          <TouchableOpacity
            onPress={() => console.log("Create Flashcard Pressed")}
            className="bg-[#FFBF23] p-3 rounded-lg items-center justify-center"
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
