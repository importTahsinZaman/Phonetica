import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const LangMap = (langNum) => {
  langNum = langNum.toString();
  let language = "";
  switch (langNum) {
    case "1":
      language = "English";
      break;
    case "2":
      language = "Chinese";
      break;
    case "3":
      language = "Spanish";
      break;
    case "4":
      language = "Spanish";
      break;
    default:
      language = "English";
  }

  return language;
};

export const DeeplLangAbbreviationMap = (langNum) => {
  langNum = langNum.toString();
  let abbreviation = "";
  switch (langNum) {
    case "1":
      abbreviation = "EN-US";
      break;
    case "2":
      abbreviation = "ZH";
      break;
    case "3":
      abbreviation = "ES";
      break;
    case "4":
      abbreviation = "ES";
      break;
    default:
      abbreviation = "EN-US";
  }

  return abbreviation;
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
    await AsyncStorage.setItem("TargetLanguage", value);
  } catch (e) {
    console.log(e);
  }
};
