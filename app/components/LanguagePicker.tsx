import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import LanguageData from "../assets/Languages.json";

import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const init = async () => {
    if (!disabled) {
      try {
        const value = await AsyncStorage.getItem("TargetLanguage");
        if (value !== null) {
          //Function name is set country but really we're setting language
          setCountry(value);
        }
      } catch (e) {
        console.log(e);
      }
    } else if (disabled) {
      //Function name is set country but really we're setting language
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
        try {
          await AsyncStorage.setItem("TargetLanguage", e.value);
        } catch (e) {
          console.log(e);
        }
      }}
      disable={disabled}
    />
  );
};

export default LanguagePicker;
