import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import CustomText from "./CustomText";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonComponent from "./SkeletonComponent";

const PAGE_WIDTH = Dimensions.get("window").width;

const PronounceContainer = ({
  EnglishText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
}) => {
  const isFocused = useIsFocused();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playBackSpeed, setPlayBackSpeed] = useState(0.8);

  const getSavedPlayBackSpeed = async () => {
    try {
      await AsyncStorage.getItem("pronounce_playback_speed").then((value) => {
        if (value !== null) {
          setPlayBackSpeed(parseFloat(value));
        } else {
          setPlayBackSpeed(0.8);
        }
      });
    } catch (e) {
      setPlayBackSpeed(0.8);
    }
  };

  useEffect(() => {
    Speech.stop();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      Speech.stop();
    } else if (isFocused) {
      getSavedPlayBackSpeed();
    }
  }, [isFocused]);

  return (
    <View
      className="bg-[#F6F6F6] rounded-xl p-4 my-4 h-[350]"
      style={{ marginHorizontal: PAGE_WIDTH * 0.05333333333 }}
    >
      <View className="flex flex-row justify-between items-center">
        <CustomText className="text-[#8D8D8D] ">English (US)</CustomText>
        <CustomText className="text-[#8D8D8D]">
          Playback Speed: {playBackSpeed}
        </CustomText>
      </View>
      <ScrollView>
        {EnglishText ? (
          <CustomText className="mt-2 text-base">{EnglishText}</CustomText>
        ) : (
          <SkeletonComponent
            marginTop={5}
            count={4}
            width={PAGE_WIDTH * 0.80676328502}
          />
        )}
      </ScrollView>

      <View className=" flex flex-row justify-around items-center mb-3">
        <View>
          <TouchableOpacity
            className="bg-[#FFBF23] rounded-full p-4 flex justify-center items-center"
            onPress={async () => {
              setPlaying(false);
              setPaused(false);

              Speech.stop();

              let newPlayBackSpeed = 1.0;

              if (playBackSpeed == 1.0) {
                newPlayBackSpeed = 0.2;
              } else if (playBackSpeed == 0.8) {
                newPlayBackSpeed = 1.0;
              } else if (playBackSpeed == 0.6) {
                newPlayBackSpeed = 0.8;
              } else if (playBackSpeed == 0.4) {
                newPlayBackSpeed = 0.6;
              } else if (playBackSpeed == 0.2) {
                newPlayBackSpeed = 0.4;
              }

              setPlayBackSpeed(newPlayBackSpeed);

              try {
                await AsyncStorage.setItem(
                  "pronounce_playback_speed",
                  newPlayBackSpeed.toString()
                );
              } catch (e) {
                // saving error
              }
            }}
          >
            <Ionicons name="speedometer" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            className="bg-[#FFBF23] rounded-full p-5 flex justify-center items-center"
            onPress={() => {
              if (playing) {
                Speech.pause();
                setPaused(true);
                setPlaying(false);
              } else if (!playing) {
                if (paused) {
                  Speech.resume();
                  setPaused(false);
                  setPlaying(true);
                } else if (!paused) {
                  Speech.speak(EnglishText, {
                    voice: "com.apple.ttsbundle.siri_Aaron_en-US_compact",
                    rate: playBackSpeed,
                    onDone: () => {
                      setPlaying(false);
                      setPaused(false);
                    },
                  });
                  setPlaying(true);
                  setPaused(false);
                }
              }
            }}
          >
            <Ionicons
              name={playing ? "pause" : "play"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            className="bg-[#FFBF23] rounded-full p-4 flex justify-center items-center"
            onPress={() => {
              setPlaying(false);
              setPaused(false);

              Speech.stop();
            }}
          >
            <Ionicons name="stop" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PronounceContainer;
