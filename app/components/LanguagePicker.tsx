import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import LanguageData from "../assets/Languages.json";

import {
  getUserTargetLanguage,
  setUserTargetLanguage,
} from "./HelperFunctions";

import { useIsFocused } from "@react-navigation/native";

const LanguagePicker = ({ disabled = false, size = 24, fontSize = 13 }) => {
  const isFocused = useIsFocused();
  const [country, setCountry] = useState("1");

  const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      width: 105,
      borderRadius: 22,
      paddingHorizontal: 8,
    },
    imageStyle: {
      width: size,
      height: size,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: fontSize,
      marginLeft: 2.5,
      fontWeight: "600",
    },
    iconStyle: {
      //Down Arrow
      tintColor: "black",
      width: disabled ? 0 : 20,
      height: disabled ? 0 : 20,
    },
  });

  const init = () => {
    if (!disabled) {
      //Function name is set country but really we're setting language
      getUserTargetLanguage().then((language) => setCountry(language));
    } else if (disabled) {
      setCountry("1");
    }
  };

  useEffect(() => {
    if (isFocused) {
      init();
    }
  }, [isFocused]);

  return (
    <SelectCountry
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      imageStyle={styles.imageStyle}
      iconStyle={styles.iconStyle}
      maxHeight={200}
      value={country}
      data={LanguageData}
      valueField="value"
      labelField="label"
      imageField="image"
      placeholder="ENG"
      searchPlaceholder="Search"
      onChange={async (e) => {
        //Function name is set country but really we're setting language
        setCountry(e.value);
        setUserTargetLanguage(e.value);
      }}
      disable={disabled}
    />
  );
};

export default LanguagePicker;
