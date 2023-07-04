import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CustomText from "./CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tabBarRef } from "./HelperFunctions";

const PAGE_WIDTH = Dimensions.get("window").width;
const COUNT = 2;

const Flashcards = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [flashcards, setFlashcards] = useState([]);
  const [indexArray, setIndexArray] = useState([]);

  const getFlashcards = async () => {
    const flashcardsStringJSON = await AsyncStorage.getItem("Flashcards");
    const flashcardsJSON = JSON.parse(flashcardsStringJSON);

    setFlashcards(flashcardsJSON);
    setIndexArray(Array.from(Array(flashcardsJSON.length).keys()));
  };

  useEffect(() => {
    if (isFocused) {
      getFlashcards();
    }
  }, [isFocused]);

  return (
    <View className="w-screen">
      <Carousel
        vertical={false}
        windowSize={11}
        width={PAGE_WIDTH / COUNT}
        height={PAGE_WIDTH / 2}
        loop={false}
        autoPlay={false}
        pagingEnabled={false}
        snapEnabled={false}
        style={{ width: "100%" }}
        data={indexArray}
        renderItem={({ index }) => (
          <TouchableOpacity
            className="m-2 flex-1 rounded-xl bg-[#F6F6F6] shadow flex"
            style={{ elevation: 15 }}
            onPress={() => {
              tabBarRef?.current?.setVisible(false);
              navigation.navigate("Flashcard", {
                initialFlashcardIndex: index,
                initialFeeling: flashcards[index]["feeling"],
              });
            }}
          >
            <View className="p-2.5 mb-10">
              <CustomText
                fontThicknessNumber={4}
                className="text-left text-base"
              >
                '{flashcards[index]["word"]}'
              </CustomText>
              <CustomText className="text-left leading-5 text-[#8D8D8D] mt-2 text-[14px]">
                {flashcards[index]["text"]}
              </CustomText>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Flashcards;
