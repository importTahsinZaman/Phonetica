// Importing necessary modules and components for the app
import "expo-dev-client";
import React, { createRef, useEffect, useCallback, useState } from "react";
import { Animated, StyleSheet, Pressable, View } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

// Importing SVG icons for the app
import HomeIcon from "./app/assets/HomeIcon.svg";
import LearnIcon from "./app/assets/LearnIcon.svg";
import ScanIcon from "./app/assets/ScanIcon.svg";

// Importing helper functions for the app
import { tabBarRef } from "./app/components/HelperFunctions";

// Importing screens for the app
import HomeScreen from "./app/screens/HomeScreen";
import LearnScreen from "./app/screens/LearnScreen";
import ScanScreen from "./app/screens/ScanScreen";
import TextSelectScreen from "./app/screens/TextSelectScreen";
import TranslationScreen from "./app/screens/TranslationScreen";
import OnboardingScreen from "./app/screens/OnboardingScreen";
import FlashcardScreen from "./app/screens/FlashcardScreen";

// Importing splash screen and async storage for the app
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing fonts for the app
import {
  useFonts,
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";

import Constants, { ExecutionEnvironment } from "expo-constants";

import Toast, { BaseToast } from "react-native-toast-message";

if (__DEV__) {
  import("./app/components/ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}
SplashScreen.preventAutoHideAsync();

// `true` when running in Expo Go.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let analytics;
if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  analytics = require("@react-native-firebase/analytics").default;
}

const Stack = createNativeStackNavigator();
const toastConfig = {
  success: (props) => (
    <BaseToast {...props} style={{ borderLeftColor: "#FFBF23" }} />
  ),
};

// Main App component
const App = () => {
  // Loading fonts for the app
  let [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  // State variable to check if it's the first launch of the app
  const [isFirstLaunch, setIsFirstLaunch] = useState<null | boolean>(null);

  // Checking if it's the first launch of the app
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then(async (value) => {
      if (value == null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  // Function to hide the splash screen
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Function to render the correct icon based on the route name
  const _renderIcon = (routeName: "Home" | "Learn", selectedTab) => {
    const ICON_SIZE = 33.12;

    switch (routeName) {
      case "Home":
        return (
          <HomeIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ color: routeName === selectedTab ? "#FFBF23" : "#8D8D8D" }}
          />
        );
        break;
      case "Learn":
        return (
          <LearnIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            style={{ color: routeName === selectedTab ? "#FFBF23" : "#8D8D8D" }}
          />
        );
        break;
    }
  };

  // Function to render the tab bar
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <Pressable onPress={() => navigate(routeName)} style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </Pressable>
    );
  };

  // If it's the first launch or the fonts are not loaded, return null
  if (isFirstLaunch == null || !fontsLoaded) {
    return null;
  }

  // Return the main app component
  return (
    <NavigationContainer>
      <StatusBar hidden={false} style={"dark"} />
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        ref={tabBarRef}
        initialRouteName={isFirstLaunch ? "Onboarding" : "Home"}
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={72}
        bgColor="white"
        screenOptions={{
          header: () => null,
        }}
        borderTopLeftRight
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <Pressable
              style={styles.button}
              onPress={() => {
                navigate("Scan");
              }}
            >
              <ScanIcon width={33.12} height={33.12} />
            </Pressable>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >
        <CurvedBottomBarExpo.Screen
          name="Home"
          position="LEFT"
          component={HomeScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="Learn"
          component={LearnScreen}
          position="RIGHT"
        />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen
          name="TextSelect"
          component={TextSelectScreen}
          initialParams={{ ReturnHome: false, BackNavigation: false }}
        />
        <Stack.Screen
          name="Translation"
          component={TranslationScreen}
          initialParams={{ ReturnHome: false }}
        />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} />
      </CurvedBottomBarExpo.Navigator>
      <View onLayout={onLayoutRootView}></View>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

// Styles for the app
const styles = StyleSheet.create({
  // Style for the button
  button: {
    flex: 1,
    justifyContent: "center",
  },
  // Style for the bottom bar
  bottomBar: {
    zIndex: 999,
    backgroundColor: "#0000",
  },
  // Style for the shadow
  shadow: {
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 19,
    elevation: 15,
    backgroundColor: "#0000",
  },
  // Style for the circle button
  btnCircleUp: {
    width: 77.28,
    height: 77.28,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbf23",
    bottom: 60.032,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  // Style for the tab bar item
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Style for the image
  img: {
    width: 30,
    height: 30,
  },
});

// Exporting the App component
export default App;
