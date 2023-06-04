import React, { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";

const CustomText = ({ fontThicknessNumber = 2, style = {}, ...props }) => {
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
