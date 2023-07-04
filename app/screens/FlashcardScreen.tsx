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
import { TouchableOpacity as RNGH } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const FLASHCARD_WIDTH = PAGE_WIDTH;
const FLASHCARD_HEIGHT = PAGE_HEIGHT * 0.7142;

const flashcardCarouselRef = createRef();

const FlashcardScreen = ({ route, navigation }) => {
  const { initialFlashcardIndex, initialFeeling } = route.params;
  const isFocused = useIsFocused();
  const [flashcardsJSON, setFlashcardsJSON] = useState([]);
  const [indexArray, setIndexArray] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState();
  const [currentFeeling, setCurrentFeeling] = useState();
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
    setIndexArray(Array.from(Array(flashcardsJSON.length).keys()));
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

  useEffect(() => {
    spin.value = 0;
    if (isFocused) {
      // the scrollTo() line only works when theres a comma after 'initialFlashcardIndex' but prettier wants to get rid of it, thus prettier ignore is required
      // prettier-ignore
      flashcardCarouselRef?.current?.scrollTo({ index: initialFlashcardIndex, });

      getFlashcardJSON();

      setCurrentFlashcardIndex(initialFlashcardIndex);
      setCurrentFeeling(initialFeeling);
    }
  }, [isFocused]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Use scrollTo() inside the callback to ensure it executes after the initial render
        // the scrollTo() line only works when theres a comma after 'initialFlashcardIndex' but prettier wants to get rid of it, thus prettier ignore is required
        // prettier-ignore
        flashcardCarouselRef?.current?.scrollTo({ index: initialFlashcardIndex, });
      });
    });
  }, []);

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
        // windowSize={11}
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
        data={indexArray}
        onScrollEnd={(index) => {
          setCurrentFlashcardIndex(index);
          setCurrentFeeling(flashcardsJSON[index]["feeling"]);
        }}
        onProgressChange={() => {
          spin.value = 0;
        }}
        style={{}}
        renderItem={({ index }) => {
          return (
            <Pressable
              onPress={() => {
                spin.value = spin.value ? 0 : 1;
              }}
            >
              <Animated.View
                style={[
                  Styles.flashcard,
                  currentFlashcardIndex === index && bStyle,
                ]}
              >
                <CustomText>"Back View: " + {index}</CustomText>
              </Animated.View>
              <Animated.View
                style={[
                  Styles.flashcard,
                  currentFlashcardIndex === index && rStyle,
                ]}
              >
                <CustomText>{index}</CustomText>
              </Animated.View>
            </Pressable>
          );
        }}
      ></Carousel>

      {/* Emoji Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingVertical: 12,
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
          onPress={() => console.log(0)}
        >
          <Text style={{ fontSize: 20 }}>😁</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  flashcard: {
    backfaceVisibility: "hidden",
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: FLASHCARD_HEIGHT,
    width: FLASHCARD_WIDTH,
  },
});

export default FlashcardScreen;
