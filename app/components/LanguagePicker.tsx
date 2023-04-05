import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import LanguageData from "../assets/Languages.json";

const LanguagePicker = ({}) => {
  const [country, setCountry] = useState("1");

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
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: 100,
    borderRadius: 22,
    paddingHorizontal: 8,
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 13,
    marginLeft: 1.5,
    fontWeight: "600",
    // fontFamily: "SpaceGrotesk_600SemiBold",
  },
  iconStyle: {
    tintColor: "black",
    width: 20,
    height: 20,
  },
});

export default LanguagePicker;
