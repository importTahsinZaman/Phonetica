import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import CustomText from "./CustomText";
import { useIsFocused } from "@react-navigation/native";

const PAGE_WIDTH = Dimensions.get("window").width;

const PronounceContainer = ({
  EnglishText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,",
}) => {
  const isFocused = useIsFocused();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playBackSpeed, setPlayBackSpeed] = useState(0.8);

  useEffect(() => {
    Speech.stop();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      Speech.stop();
    }
  }, [isFocused]);

  useEffect(() => {
    console.log("playing: ", playing, "paused: ", paused);
  }, [playing, paused]);

  return (
    <SafeAreaView>
      <View
        className="bg-[#F6F6F6] rounded-xl p-4 my-4 h-[35vh]"
        style={{ marginHorizontal: PAGE_WIDTH * 0.05333333333 }}
      >
        <View className="flex flex-row justify-between items-center">
          <CustomText className="text-[#8D8D8D] ">English (US)</CustomText>
          <CustomText className="text-[#8D8D8D]">
            Playback Speed: {playBackSpeed}
          </CustomText>
        </View>
        <ScrollView>
          <CustomText className="mt-3 text-base">{EnglishText}</CustomText>
        </ScrollView>

        <View className=" flex flex-row justify-around items-center mb-3">
          <View>
            <TouchableOpacity
              className="bg-[#FFBF23] rounded-full p-4 flex justify-center items-center"
              onPress={() => {
                if (playBackSpeed == 1.0) {
                  setPlayBackSpeed(0.2);
                } else if (playBackSpeed == 0.8) {
                  setPlayBackSpeed(1.0);
                } else if (playBackSpeed == 0.6) {
                  setPlayBackSpeed(0.8);
                } else if (playBackSpeed == 0.4) {
                  setPlayBackSpeed(0.6);
                } else if (playBackSpeed == 0.2) {
                  setPlayBackSpeed(0.4);
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
    </SafeAreaView>
  );
};

export default PronounceContainer;
