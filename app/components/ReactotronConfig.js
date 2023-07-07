import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

Reactotron.onCustomCommand("clear storage", () => {
  AsyncStorage.clear();
});

Reactotron.onCustomCommand("complete onboarding", async () => {
  const d = new Date();
  const date = d.toLocaleDateString();
  let time = d.toLocaleTimeString();
  time = time.slice(0, 4) + time.slice(7);

  const flashDef1 =
    "In this context, 'remember' means to retain and recall information or words that you have learned in the past. In the given sentence, it suggests that flashcards are useful for aiding the process of learning and retaining new words encountered during reading, and during flashcard review, you can indicate your familiarity with each word by selecting the appropriate emoji.";

  const flashDef2 =
    "Deck refers to a set of cards usually used in various games. In this context, 'deck' refers to a set of flashcards";

  const flashCardJson = JSON.stringify([
    {
      word: "Remember",
      instanceNumber: 1,
      text: "Flashcards help you learn and remember words you find while reading. When you're reviewing your flashcards, click the emoji that corresponds to how well you know the word.",
      definition: flashDef1,
      englishDefinition: flashDef1,
      feeling: 3,
    },

    {
      word: "Deck",
      instanceNumber: 1,
      text: "To add a flashcard to your deck, scan text, define a word, and at the bottom of your screen click 'Add Flashcard'!",
      definition: flashDef2,
      englishDefinition: flashDef2,
      feeling: 3,
    },
  ]);

  await AsyncStorage.multiSet([
    ["alreadyLaunched", "true"],
    [
      "RecentScan0",
      "Tutorial Scan: Use this text as a demo scan. In a cozy little town, there lived a girl named Lily. She loved exploring nature and had a magical ability to talk to animals. One sunny day, Lily met a squirrel named Nutmeg. Nutmeg told her about a hidden treasure in the nearby forest. Excited, they ventured into the woods together. Along the way, they encountered a wise owl, a mischievous rabbit, and a friendly deer. With their help, Lily and Nutmeg found the treasure—a sparkling necklace made of emeralds! Lily shared the treasure with her new animal friends, and they celebrated with a joyful dance. From that day on, they became inseparable companions, exploring the wonders of the world together.",
    ],
    [
      "RecentScan1",
      "Tutorial Scan: Use this text as a demo scan. In the bustling city of Brightville, there was a young boy named Max. Max had a passion for inventions and dreams of becoming a famous inventor someday. One afternoon, he discovered an old, dusty box in his grandfather's attic. Inside, he found a pair of goggles with peculiar gears and buttons. Curiosity sparked in Max's eyes as he put them on. To his amazement, the goggles transported him to a world filled with talking robots and flying cars. Max couldn't believe his eyes! He spent days exploring this futuristic realm, making new robotic friends and inventing incredible gadgets. When he returned home, Max knew that one day, he would turn his imagination into reality and change the world with his inventions.",
    ],
    ["RecentScan2", ""],
    ["RecentScan3", ""],
    ["RecentScan4", ""],
    ["RecentScanTime0", date + "&$&" + time],
    ["RecentScanTime1", date + "&$&" + time],
    ["RecentScanTime2", ""],
    ["RecentScanTime3", ""],
    ["RecentScanTime4", ""],
    ["ScanCount", "0"],
    ["Flashcards", flashCardJson],
  ]);
});
