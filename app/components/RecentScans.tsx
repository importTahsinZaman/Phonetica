import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Dimensions, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CustomText from "./CustomText";

import { tabBarRef } from "../../App";

const RecentScans = ({ navigation }) => {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const COUNT = 2;

  const [savedScans, setSavedScans] = useState([]);
  const [scanTitles, setScanTitles] = useState([]);
  const [scanTimes, setScanTimes] = useState([]);
  const [indexArray, setIndexArray] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getSavedScans();
    }
  }, [isFocused]);

  const getSavedScans = async () => {
    let tempSavedScans = [];
    let tempSavedScanTimes = [];

    try {
      tempSavedScans = await AsyncStorage.multiGet([
        "RecentScan0",
        "RecentScan1",
        "RecentScan2",
        "RecentScan3",
        "RecentScan4",
      ]);

      tempSavedScanTimes = await AsyncStorage.multiGet([
        "RecentScanTime0",
        "RecentScanTime1",
        "RecentScanTime2",
        "RecentScanTime3",
        "RecentScanTime4",
      ]);
    } catch (e) {
      console.log("Error in getSavedScans(): " + e);
    }

    for (let i = 0; i < 5; i++) {
      try {
        if (tempSavedScans[i][1] === null || tempSavedScans[i][1] === "") {
          tempSavedScans.splice(i, 1);
          tempSavedScanTimes.splice(i, 1);
        }
      } catch (e) {}
    }

    let tempScanTitles = [];

    for (let i = 0; i < 5; i++) {
      try {
        let words = tempSavedScans[i][1];
        words = words
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\s+/g, " ")
          .trim();
        let result = words.split(" ").slice(0, 3).join(" ");
        tempScanTitles.push(result + "...");
      } catch (e) {}
    }

    if (tempSavedScans.length === 0) {
      tempSavedScans.push([
        "RecentScan0",
        "Use this 'recent scan' as demo scan text!",
      ]);

      const d = new Date();
      const date = d.toLocaleDateString();
      let time = d.toLocaleTimeString();
      time = time.slice(0, 4) + time.slice(7);

      tempScanTitles.push(date + "&$&" + time);
    }

    setSavedScans(tempSavedScans);
    setScanTimes(tempSavedScanTimes);
    setScanTitles(tempScanTitles);
    setIndexArray([...new Array(tempSavedScans.length).keys()]);
  };

  const openRecentScan = async (index: number) => {
    let newScans = savedScans;
    let newTimes = scanTimes;

    let currentScan = ["RecentScan0", savedScans[index][1]];

    const d = new Date();
    const date = d.toLocaleDateString();
    let time = d.toLocaleTimeString();
    time = time.slice(0, 4) + time.slice(7);
    let currentTime = date + "&$&" + time;

    newScans.splice(index, 1);
    newTimes.splice(index, 1);

    newScans.unshift(currentScan);
    newTimes.unshift(["RecentScanTime0", currentTime]);

    let i = 0;
    newScans.forEach((scan) => {
      scan[0] = "RecentScan" + i;
      i++;
    });

    i = 0;
    newTimes.forEach((time) => {
      time[0] = "RecentScanTime" + i;
      i++;
    });

    await AsyncStorage.multiSet(newScans);
    await AsyncStorage.multiSet(newTimes);

    tabBarRef?.current?.setVisible(false);
    navigation.navigate("TextSelect");
  };

  return (
    <Carousel
      vertical={false}
      width={PAGE_WIDTH / COUNT}
      height={PAGE_WIDTH / 2}
      loop={savedScans.length > 1 ? true : false}
      autoPlay={false}
      pagingEnabled={false}
      snapEnabled={false}
      style={{ width: PAGE_WIDTH }}
      data={indexArray}
      renderItem={({ index }) => (
        <View className="m-2 flex-1 rounded-xl bg-white shadow justify-center flex">
          <TouchableOpacity
            onPress={() => {
              openRecentScan(index);
            }}
            className="p-2.5 w-full h-full"
          >
            <CustomText className="text-[#8D8D8D]">
              {savedScans[index][1]}
            </CustomText>
          </TouchableOpacity>
          <View className="bg-[#FFBF23] h-[30%] w-full mt-auto rounded-b-xl justify-between p-1.5">
            <CustomText
              fontThicknessNumber={3}
              className="text-base whitespace-nowrap break-keep"
            >
              {scanTitles[index]}
            </CustomText>
            <View className="flex flex-row justify-between w-full">
              <CustomText>{scanTimes[index][1].split("&$&")[0]}</CustomText>
              <CustomText>{scanTimes[index][1].split("&$&")[1]}</CustomText>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default RecentScans;
