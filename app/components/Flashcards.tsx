import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CustomText from "./CustomText";

const Flashcards = ({}) => {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const COUNT = 2;

  return (
    <View className="w-screen">
      <Carousel
        vertical={false}
        width={PAGE_WIDTH / COUNT}
        height={PAGE_WIDTH / 2}
        loop={true}
        autoPlay={false}
        pagingEnabled={false}
        snapEnabled={false}
        style={{ width: "100%" }}
        data={[...new Array(12).keys()]}
        renderItem={({ index }) => (
          <View
            className="m-2 flex-1 rounded-xl bg-[#F6F6F6] shadow flex"
            style={{ elevation: 15 }}
          >
            <View className="p-2.5 mb-10">
              <CustomText
                fontThicknessNumber={4}
                className="text-left text-base"
              >
                'Remember'
              </CustomText>
              <CustomText className="text-left leading-5 text-[#8D8D8D] mt-2 text-[14px]">
                Flashcards help you learn and remember words you find while
                reading. When you're reviewing your flashcards, click the check
                if you know the word to remove it from your deck or the x to
                keep it around to review again later!
              </CustomText>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Flashcards;
