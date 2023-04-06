const LangMap = (langNum) => {
  langNum = langNum.toString();
  let language = "";
  switch (langNum) {
    case "1":
      language = "English";
      break;
    case "2":
      language = "Spanish";
      break;
    case "3":
      language = "Spanish";
      break;
    case "4":
      language = "Bangla";
      break;
    case "5":
      language = "Chinese";
      break;
    default:
      language = "English";
  }

  return language;
};

export default LangMap;
