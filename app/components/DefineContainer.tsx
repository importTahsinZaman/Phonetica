import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import CustomText from "./CustomText";
import SpeakerIcon from "../assets/SpeakerIcon.svg";
import { useTargetLangStringGlobal } from "./LanguagePicker";

type ComponentProps = {
  wordsList: ItemData[];
  text: string;
  openai: any; //TODO: FIX THIS
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

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.id === selectedId ? "#FFBF23" : "#ffffff";
    const borderColor = item.id === selectedId ? "#FFBF23" : "#8D8D8D30";

    return (
      <Item
        item={item}
        onPress={() => {
          if (item.id !== selectedId) {
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

  return (
    <SafeAreaView className="my-4 w-full min-h-[54.008908686%] max-h-[54.008908686%] justify-between">
      <SafeAreaView
        className="mx-4 max-h-[29.072164948%]"
        style={styles.wordsContainer}
      >
        <FlatList
          className=" w-full"
          data={wordsList}
          numColumns={4}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
      </SafeAreaView>

      <SafeAreaView className="grow flex ">
        {definitionExplanation && (
          <SafeAreaView className="flex  my-10 flex-row justify-self-start min-h-[29.896907216%]">
            <SpeakerIcon></SpeakerIcon>
            <SafeAreaView className="">
              <CustomText className="text-xl">
                '
                {wordsList[parseInt(selectedId)].word.charAt(0).toUpperCase() +
                  wordsList[parseInt(selectedId)].word.slice(1)}
                '
              </CustomText>
              <CustomText>{definitionExplanation}</CustomText>
            </SafeAreaView>
          </SafeAreaView>
        )}

        {definitionExplanation && (
          <SafeAreaView className="bottom-0">
            <TouchableOpacity
              onPress={() => console.log("Create Flashcard Pressed")}
              className="bg-[#FFBF23]  p-3 rounded-lg flex items-center justify-center mx-6"
            >
              <CustomText>Create Flashcard</CustomText>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wordsContainer: {
    marginTop: StatusBar.currentHeight || 0,
    flexWrap: "wrap",
  },
});

export default DefineContainer;
