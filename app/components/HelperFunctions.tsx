import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguageData from "../assets/Languages.json";

//Deepl Lang Abbreviations:
// BG - Bulgarian
// CS - Czech
// DA - Danish
// DE - German
// EL - Greek
// EN - English (unspecified variant for backward compatibility; please select EN-GB or EN-US instead)
// EN-GB - English (British)
// EN-US - English (American)
// ES - Spanish
// ET - Estonian
// FI - Finnish
// FR - French
// HU - Hungarian
// ID - Indonesian
// IT - Italian
// JA - Japanese
// KO - Korean
// LT - Lithuanian
// LV - Latvian
// NB - Norwegian (Bokmål)
// NL - Dutch
// PL - Polish
// PT - Portuguese (unspecified variant for backward compatibility; please select PT-BR or PT-PT instead)
// PT-BR - Portuguese (Brazilian)
// PT-PT - Portuguese (all Portuguese varieties excluding Brazilian Portuguese)
// RO - Romanian
// RU - Russian
// SK - Slovak
// SL - Slovenian
// SV - Swedish
// TR - Turkish
// UK - Ukrainian
// ZH - Chinese (simplified)

export const LangMap = (langNum: string | number) => {
  //Converts num to full string of language, Ex: 1 to "English"
  langNum = langNum.toString();
  let obj = LanguageData.find((o) => o.value == langNum);
  return obj?.language;
};

export const DeeplLangAbbreviationMap = (langNum: string | number) => {
  //Converts num to deepl abbreviation for that corresponding language ex: 1 to EN-US, 2 to BG
  langNum = langNum.toString();
  let obj = LanguageData.find((o) => o.value == langNum);
  return obj?.DeeplAbbreviation;
};

export const getUserTargetLanguage = async () => {
  try {
    const value = await AsyncStorage.getItem("TargetLanguage");
    if (value !== null) {
      return value;
    } else if (value == null) {
      //Return English on fail
      return "1";
    }
  } catch (e) {
    //Return English on fail
    return "1";
  }
};

export const setUserTargetLanguage = async (value: string) => {
  try {
    // numerical values: 1,2,etc.
    await AsyncStorage.setItem("TargetLanguage", value);
  } catch (e) {
    console.log(e);
  }
};
