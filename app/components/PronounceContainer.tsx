import React, { useState, useEffect } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

const PronounceContainer = () => {
  const text = "this is great";
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({});
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(["this", "is", "great"]);
  }, []);

  const play = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const { sound, status } = await Speech.speak(text, {
        onDone: handlePlaybackStatusUpdate,
        onPositionChanged: handlePlaybackPositionUpdate,
        onPlaybackError: handlePlaybackError,
      });

      setPlaybackInstance(sound);
      setPlaybackStatus(status);
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  const pause = async () => {
    try {
      await playbackInstance.pauseAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error(error);
    }
  };

  const resume = async () => {
    try {
      await playbackInstance.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stop = async () => {
    try {
      await playbackInstance.stopAsync();
      setIsPlaying(false);
      setPlaybackPosition(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    setPlaybackStatus(status);
    setPlaybackDuration(status.durationMillis);
  };

  const handlePlaybackPositionUpdate = (position) => {
    setPlaybackPosition(position.positionMillis);
    setActiveWordIndex(getActiveWordIndex(position.positionMillis));
  };

  const handlePlaybackError = (error) => {
    console.error(error);
  };

  const setPosition = async (position) => {
    try {
      await playbackInstance.setPositionAsync(position);
      setPlaybackPosition(position);
      setActiveWordIndex(getActiveWordIndex(position));
    } catch (error) {
      console.error(error);
    }
  };

  const getActiveWordIndex = (position) => {
    let index = -1;
    let total = 0;

    for (let i = 0; i < words.length; i++) {
      total += words[i].length + 1;

      if (total * 1000 > position) {
        index = i;
        break;
      }
    }

    return index;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Text-to-Speech Player
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {words.map((word, index) => (
          <Text
            key={index}
            style={{
              fontSize: 16,
              marginRight: 5,
              marginBottom: 5,
              backgroundColor:
                activeWordIndex === index ? "black" : "transparent",
              color: activeWordIndex === index ? "white" : "black",
              padding: 2,
              borderRadius: 5,
            }}
          >
            {word}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={isPlaying ? pause : play}
        />
        <MaterialIcons
          name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
          size={32}
          color="black"
          onPress={isPlaying ? pause : play}
          style={{ marginLeft: 10 }}
        />
        <Button title="Stop" onPress={stop} />
      </View>
      <Slider
        style={{ marginTop: 10 }}
        value={playbackPosition}
        minimumValue={0}
        maximumValue={playbackDuration}
        minimumTrackTintColor="black"
        maximumTrackTintColor="gray"
        thumbTintColor="black"
        onSlidingComplete={setPosition}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{formatTime(playbackPosition)}</Text>
        <Text>{formatTime(playbackDuration)}</Text>
      </View>
    </SafeAreaView>
  );
};

export default PronounceContainer;
