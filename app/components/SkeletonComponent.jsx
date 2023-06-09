import { View, Dimensions, Animated, StyleSheet, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";

const PAGE_WIDTH = Dimensions.get("window").width;

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

const SkeletonComponent = ({
  width = PAGE_WIDTH,
  height = 150,
  color1 = "#a0a0a0",
  color2 = "#b0b0b0",
}) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear.inOut,
        useNativeDriver: true,
      })
    ).start();
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={{
        backgroundColor: color1,
        borderColor: color2,
        height: height,
        width: width,
      }}
    >
      <AnimatedLG
        colors={[color1, color2, color2, color1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          ...StyleSheet.absoluteFill,
          transform: [{ translateX: translateX }],
        }}
      ></AnimatedLG>
    </View>
  );
};

export default SkeletonComponent;
