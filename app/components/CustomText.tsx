import React, { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";

const CustomText = ({ fontThicknessNumber = 2, style = {}, ...props }) => {
  const [appIsReady, setAppIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    //Thickness Number 1:
    SpaceGrotesk_300Light,
    //Thickness Number 2:
    SpaceGrotesk_400Regular,
    //Thickness Number 3:
    SpaceGrotesk_500Medium,
    //Thickness Number 4:
    SpaceGrotesk_600SemiBold,
    //Thickness Number 5:
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync();
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  let chosenFontStyle = "SpaceGrotesk_400Regular";

  switch (fontThicknessNumber) {
    case 1:
      chosenFontStyle = "SpaceGrotesk_300Light";
      break;
    case 3:
      chosenFontStyle = "SpaceGrotesk_500Medium";
      break;
    case 4:
      chosenFontStyle = "SpaceGrotesk_600SemiBold";
      break;
    case 5:
      chosenFontStyle = "SpaceGrotesk_700Bold";
      break;
    default:
      chosenFontStyle = "SpaceGrotesk_400Regular";
      break;
  }

  const textStyles = {
    fontFamily: chosenFontStyle,
  };
  return <Text {...props} style={[textStyles, style]} />;
};

export default CustomText;
