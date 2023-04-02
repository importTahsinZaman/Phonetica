import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/screens/HomeScreen";
import TextSelectScreen from "./app/screens/TextSelectScreen.js";
import TranslationScreen from "./app/screens/TranslationScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: () => null,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TextSelect" component={TextSelectScreen} />
        <Stack.Screen name="Translation" component={TranslationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
