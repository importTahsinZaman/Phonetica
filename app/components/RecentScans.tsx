import * as React from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import CustomText from "./CustomText";

const RecentScans = ({}) => {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const COUNT = 2;

  return (
    <View style={{}}>
      <Carousel
        vertical={false}
        width={PAGE_WIDTH / COUNT}
        height={PAGE_WIDTH / 2}
        loop={true}
        autoPlay={false}
        pagingEnabled={false}
        snapEnabled={false}
        style={{ width: PAGE_WIDTH }}
        data={[...new Array(5).keys()]}
        renderItem={({ index }) => (
          <View className="m-2 flex-1 rounded-xl bg-white shadow justify-center flex">
            <View className="p-2.5">
              <CustomText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deleniti animi similique facere adipisci architecto ipsam cum.
                Quae cum laboriosam quis eos pariatur doloribus tempore animi
                nesciunt totam, ea vero assumenda saepe quisquam inventore
                impedit, praesentium optio obcaecati ducimus possimus labore
                doloremque sunt. Minus laborum ratione distinctio, a quam quod
                ut officia repellat officiis veritatis laudantium dicta aliquam
                consequuntur minima perspiciatis adipisci consectetur
                dignissimos vitae, cumque rerum! Similique placeat impedit ipsum
                reiciendis unde veritatis magni blanditiis fugit hic
                voluptatibus id voluptatem ipsa, tenetur maiores. Consequatur
                et, eos debitis, commodi nihil quaerat cumque magni suscipit
                ullam quibusdam corporis ex similique doloribus laudantium,
                voluptates praesentium possimus illum quam. Ipsum itaque
                excepturi id dolor corporis! At distinctio magnam ab eveniet
                neque natus sint molestiae perspiciatis. Voluptatem odit
                praesentium eum nesciunt vero amet ex error? Officia reiciendis
              </CustomText>
            </View>
            <View className="bg-[#FFBF23] h-[30%] w-full mt-auto rounded-b-xl justify-between p-1.5">
              <CustomText fontThicknessNumber={3} className="text-base">
                The Last Trip
              </CustomText>
              <View className="flex flex-row justify-between w-full">
                <CustomText>07/02/2023</CustomText>
                <CustomText>8:00 PM</CustomText>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default RecentScans;
