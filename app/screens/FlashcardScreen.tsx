import { useState, useEffect, createRef } from "react";
import ReturnHeader from "../components/ReturnHeader";
import {
  SafeAreaView,
  Dimensions,
  Pressable,
  Platform,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CustomText from "../components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { useFlashcardsGlobal } from "../components/Flashcards";
import Toast from "react-native-toast-message";
import SpeakerIcon from "../assets/SpeakerIcon.svg";
import * as Speech from "expo-speech";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const FLASHCARD_WIDTH = PAGE_WIDTH;
const FLASHCARD_HEIGHT = PAGE_HEIGHT * 0.65;

const flashcardCarouselRef = createRef();

const FlashcardScreen = ({ route, navigation }) => {
  const { initialFlashcardIndex, initialFeeling } = route.params;
  const isFocused = useIsFocused();
  const [flashcardsJSON, setFlashcardsJSON] = useFlashcardsGlobal();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState();
  const [currentFeeling, setCurrentFeeling] = useState();
  const [definitionSide, setDefinitionSide] = useState(false);
  const spin = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  const bStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  const getFlashcardJSON = async () => {
    const flashcardsStringJSON = await AsyncStorage.getItem("Flashcards");
    const flashcardsJSON = JSON.parse(flashcardsStringJSON);

    setFlashcardsJSON(flashcardsJSON);
  };

  const setFlashcardStorage = async (newFlashcardStorage) => {
    await AsyncStorage.setItem(
      "Flashcards",
      JSON.stringify(newFlashcardStorage)
    );
  };

  const updateFeeling = (newFeeling: number) => {
    setCurrentFeeling(newFeeling);

    let newFlashcardsJSON = flashcardsJSON;
    newFlashcardsJSON[currentFlashcardIndex]["feeling"] = newFeeling;

    setFlashcardsJSON(newFlashcardsJSON);
    setFlashcardStorage(newFlashcardsJSON);
  };

  const removeCard = () => {
    Toast.show({
      type: "success",
      text1:
        "Congratulations on learning '" +
        flashcardsJSON[currentFlashcardIndex]["word"] +
        "'! 🎉",
      text2: "Removed Flashcard",
    });

    if (flashcardsJSON.length > 1) {
      let newIndex;
      if (currentFlashcardIndex === flashcardsJSON.length - 1) {
        newIndex = currentFlashcardIndex - 1;
      } else {
        newIndex = currentFlashcardIndex;
      }

      let newFlashcardsJSON = flashcardsJSON;
      newFlashcardsJSON.splice(currentFlashcardIndex, 1);

      setFlashcardsJSON(newFlashcardsJSON);
      setFlashcardStorage(newFlashcardsJSON);

      navigation.navigate("Flashcard", {
        initialFlashcardIndex: newIndex,
        initialFeeling: newFlashcardsJSON[newIndex]["feeling"],
      });

      scrollTo(newIndex);

      setCurrentFlashcardIndex(newIndex);
      setCurrentFeeling(newFlashcardsJSON[newIndex]["feeling"]);
    } else {
      let newFlashcardsJSON = flashcardsJSON;
      newFlashcardsJSON.splice(currentFlashcardIndex, 1);

      setFlashcardsJSON(newFlashcardsJSON);
      setFlashcardStorage(newFlashcardsJSON);

      navigation.navigate("Flashcard", {
        initialFlashcardIndex: 0,
        initialFeeling: 3,
      });

      setCurrentFlashcardIndex(0);
      setCurrentFeeling(3);
      setDefinitionSide(false);
    }
  };

  const scrollTo = (index: number) => {
    // Use scrollTo() inside the callback to ensure it executes after the initial render
    // the scrollTo() line only works when theres a comma after 'initialFlashcardIndex' but prettier wants to get rid of it, thus prettier ignore is required
    // prettier-ignore
    flashcardCarouselRef?.current?.scrollTo({ index: index, });
  };

  const init = () => {
    setDefinitionSide(false);
    spin.value = 0;
    scrollTo(initialFlashcardIndex);

    getFlashcardJSON();

    setCurrentFlashcardIndex(initialFlashcardIndex);
    setCurrentFeeling(initialFeeling);
  };

  useEffect(() => {
    if (isFocused) {
      init();
    } else {
      Speech.stop();
    }
  }, [isFocused]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollTo(initialFlashcardIndex);
      });
    });
  }, []);

  if (flashcardsJSON.length === 0) {
    return (
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
        className="bg-white h-screen w-screen"
      >
        <ReturnHeader
          navigation={navigation}
          text="Home"
          destination="Home"
          showNavBar={true}
          color="black"
        ></ReturnHeader>
        <View className="absolute w-full h-full p-8 flex justify-center items-center">
          <CustomText fontThicknessNumber={4} className="text-2xl text-center">
            Congratulations on completing all your flashcards! 🎉
          </CustomText>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
        className="bg-white h-screen w-screen"
      >
        <ReturnHeader
          navigation={navigation}
          text="Home"
          destination="Home"
          showNavBar={true}
          color="black"
        ></ReturnHeader>
        <Carousel
          ref={flashcardCarouselRef}
          loop={false}
          windowSize={11}
          vertical={false}
          autoPlay={false}
          pagingEnabled={true}
          snapEnabled={true}
          width={FLASHCARD_WIDTH}
          height={FLASHCARD_HEIGHT}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
            parallaxAdjacentItemScale: 0.8,
          }}
          data={flashcardsJSON}
          onScrollEnd={(index) => {
            setCurrentFlashcardIndex(index);
            setCurrentFeeling(flashcardsJSON[index]["feeling"]);
          }}
          onProgressChange={(offsetProgress, absoluteProgress) => {
            if (spin.value !== 0 && absoluteProgress % 1 != 0) {
              spin.value = 0;
              setDefinitionSide(false);
            }
          }}
          style={{}}
          renderItem={({ index }) => {
            return (
              <Pressable
                onPress={() => {
                  if (spin.value == 1) {
                    setDefinitionSide(false);
                  } else {
                    setDefinitionSide(true);
                  }
                  spin.value = spin.value ? 0 : 1;
                }}
              >
                <Animated.View
                  style={[
                    Styles.flashcard,
                    currentFlashcardIndex === index && bStyle,
                  ]}
                  className="shadow"
                >
                  <CustomText
                    className="text-2xl mx-4 mt-5"
                    fontThicknessNumber={5}
                  >
                    '{flashcardsJSON[index]["word"]}'
                  </CustomText>
                  <CustomText className="text-lg mt-2 mx-4">
                    {flashcardsJSON[index]["definition"]}
                  </CustomText>
                  {flashcardsJSON[index]["definition"] !==
                    flashcardsJSON[index]["englishDefinition"] && (
                    <CustomText className="text-lg mt-2 mx-4">
                      {flashcardsJSON[index]["englishDefinition"]}
                    </CustomText>
                  )}
                </Animated.View>
                <Animated.View
                  style={[
                    Styles.flashcard,
                    currentFlashcardIndex === index && rStyle,
                  ]}
                  className="shadow"
                >
                  <CustomText
                    className="text-2xl mx-4 mt-5"
                    fontThicknessNumber={5}
                  >
                    '{flashcardsJSON[index]["word"]}'
                  </CustomText>
                  <CustomText className="text-lg mt-2 mx-4">
                    {flashcardsJSON[index]["text"]}
                  </CustomText>
                </Animated.View>
              </Pressable>
            );
          }}
        ></Carousel>

        {/* Emoji Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 4,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#FFBF23",
              borderRadius: 12,
              width: 180,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
              marginLeft: 25,
              marginHorizontal: 10,
              alignItems: "center",
              flexDirection: "row",
              paddingVertical: 10,
              paddingLeft: 8,
            }}
            onPress={() =>
              Speech.speak(flashcardsJSON[currentFlashcardIndex]["word"], {
                rate: 0.8,
              })
            }
          >
            <SpeakerIcon></SpeakerIcon>
            <CustomText style={{ fontSize: 16 }}>Word</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#FFBF23",
              borderRadius: 12,
              width: 180,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
              marginRight: 25,
              marginHorizontal: 10,
              alignItems: "center",
              flexDirection: "row",
              paddingLeft: 8,
            }}
            onPress={() => {
              if (definitionSide) {
                Speech.speak(
                  flashcardsJSON[currentFlashcardIndex]["englishDefinition"],
                  {
                    rate: 0.8,
                  }
                );
              } else {
                Speech.speak(flashcardsJSON[currentFlashcardIndex]["text"], {
                  rate: 0.8,
                });
              }
            }}
          >
            <SpeakerIcon></SpeakerIcon>
            <CustomText style={{ fontSize: 16 }}>
              {definitionSide ? "Definition" : "Sentence"}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* emoji row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginVertical: 25,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: currentFeeling == 3 ? "#FFBF23" : "#F6F6F6",
              borderRadius: 12,
              padding: 18,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => updateFeeling(3)}
          >
            <Text style={{ fontSize: 20 }}>😥</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: currentFeeling == 2 ? "#FFBF23" : "#F6F6F6",
              borderRadius: 12,
              padding: 18,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => updateFeeling(2)}
          >
            <Text style={{ fontSize: 20 }}>😕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: currentFeeling == 1 ? "#FFBF23" : "#F6F6F6",
              borderRadius: 12,
              padding: 18,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => updateFeeling(1)}
          >
            <Text style={{ fontSize: 20 }}>😐</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: false ? "#FFBF23" : "#F6F6F6",
              borderRadius: 12,
              padding: 18,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => removeCard()}
          >
            <Text style={{ fontSize: 20 }}>😁</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

const Styles = StyleSheet.create({
  flashcard: {
    backfaceVisibility: "hidden",
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    // shadowColor: "black",
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    // elevation: 4,
    position: "absolute",
    height: FLASHCARD_HEIGHT,
    width: FLASHCARD_WIDTH,
    justifyContent: "center",
  },
});

export default FlashcardScreen;
