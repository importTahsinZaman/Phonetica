import { useState, useEffect } from "react";
import ReturnHeader from "../components/ReturnHeader";
import {
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const FLASHCARD_WIDTH = PAGE_WIDTH;
const FLASHCARD_HEIGHT = PAGE_HEIGHT * 0.7142;

const FlashcardScreen = ({ route, navigation }) => {
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
        loop={false}
        vertical={false}
        autoPlay={false}
        pagingEnabled={false}
        snapEnabled={true}
        width={FLASHCARD_WIDTH}
        height={FLASHCARD_HEIGHT}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={[...new Array(6).keys()]}
        style={{}}
        renderItem={({ index }) => {
          return (
            <Pressable onPress={() => (spin.value = spin.value ? 0 : 1)}>
              <Animated.View style={[bStyle, Styles.flashcard]}>
                <CustomText>"Back View: " + {index}</CustomText>
              </Animated.View>
              <Animated.View style={[rStyle, Styles.flashcard]}>
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
          <Text style={{ fontSize: 20 }}>😥</Text>
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
          <Text style={{ fontSize: 20 }}>😕</Text>
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
