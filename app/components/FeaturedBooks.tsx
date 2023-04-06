import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const FeaturedBooks = ({}) => {
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
            style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FeaturedBooks;
