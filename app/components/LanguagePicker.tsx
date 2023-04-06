import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import LanguageData from "../assets/Languages.json";

const LanguagePicker = ({ disabled = false, size = 24, fontSize = 13 }) => {
  const [country, setCountry] = useState("1");

  const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      width: 100,
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
      labelField="lable"
      imageField="image"
      placeholder="Select"
      searchPlaceholder="Search..."
      onChange={(e) => {
        setCountry(e.value);
      }}
      disable={disabled}
    />
  );
};

export default LanguagePicker;
