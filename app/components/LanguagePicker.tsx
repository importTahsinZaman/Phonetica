import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SelectCountry } from "react-native-element-dropdown";
import LanguageData from "../assets/Languages.json";

import {
  getUserTargetLanguage,
  setUserTargetLanguage,
  LangMap,
  AbbreviationMap,
} from "./HelperFunctions";

import { GlobalStore } from "react-native-global-state-hooks";

import { useIsFocused } from "@react-navigation/native";

const TARGET_LANG_NUM = new GlobalStore("1");
const TARGET_LANG_STRING = new GlobalStore("English");
const TARGET_LANG_ABBREVIATION = new GlobalStore("EN-US");

export const useTargetLangNumGlobal = TARGET_LANG_NUM.getHook();
export const useTargetLangStringGlobal = TARGET_LANG_STRING.getHook();
export const useTargetLangAbbreviationGlobal =
  TARGET_LANG_ABBREVIATION.getHook();

const LanguagePicker = ({
  disabled = false,
  size = 24,
  fontSize = 13,
  coolDown = false,
}) => {
  const isFocused = useIsFocused();
  const [country, setCountry] = useState("1");

  const [targetLangNum, setTargetLangNum] = useTargetLangNumGlobal();
  const [targetLangString, setTargetLangString] = useTargetLangStringGlobal();
  const [targetLangAbbreviation, setTargetLangAbbreviation] =
    useTargetLangAbbreviationGlobal();

  const [coolingDown, setCoolingDown] = useState(false);

  const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      width: fontSize * 7.4,
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
      width: disabled || coolingDown ? 0 : 20,
      height: disabled || coolingDown ? 0 : 20,
    },
  });

  const init = async () => {
    if (!disabled) {
      //Function name is set country but really we're setting language
      await getUserTargetLanguage().then((language) => {
        //This setCountry is just for the picker UI
        setCountry(language);
        //These setStates are for app's global targetLanguage state
        setTargetLangNum(language);
        setTargetLangString(LangMap(language));
        setTargetLangAbbreviation(AbbreviationMap(language));
      });
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
        if (e.value != country) {
          if (!coolingDown) {
            if (coolDown) {
              setCoolingDown(true);
            }
            //Function name is set country but really we're setting language. This setCountry is just for UI
            setCountry(e.value);
            //Async Storage Set:
            await setUserTargetLanguage(e.value);
            //Global State Sets:
            setTargetLangNum(e.value);
            setTargetLangString(LangMap(e.value));
            setTargetLangAbbreviation(AbbreviationMap(e.value));

            if (coolDown) {
              const delay = (ms) => new Promise((res) => setTimeout(res, ms));
              await delay(10000);
              setCoolingDown(false);
            }
          }
        }
      }}
      disable={disabled || coolingDown}
    />
  );
};

export default LanguagePicker;
