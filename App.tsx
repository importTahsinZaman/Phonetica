import "expo-dev-client";
import React, { createRef, useEffect, useCallback, useState } from "react"; // <== import createRef
import { Animated, StyleSheet, Pressable } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import HomeIcon from "./app/assets/HomeIcon.svg";
import LearnIcon from "./app/assets/LearnIcon.svg";
import ScanIcon from "./app/assets/ScanIcon.svg";

import HomeScreen from "./app/screens/HomeScreen";
import LearnScreen from "./app/screens/LearnScreen";
import ScanScreen from "./app/screens/ScanScreen";
import TextSelectScreen from "./app/screens/TextSelectScreen";
import TranslationScreen from "./app/screens/TranslationScreen";
import OnboardingScreen from "./app/screens/OnboardingScreen";

import * as SplashScreen from "expo-splash-screen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";

import Constants, { ExecutionEnvironment } from "expo-constants";

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

export const tabBarRef = createRef(); //Call this function to hide tabbar: tabBarRef?.current?.setVisible(false);

const App = () => {
  let [fontsLoaded] = useFonts({
    //Thickness Number 1:
    SpaceGrotesk_300Light,
    //Thickness Number 2:
    SpaceGrotesk_400Regular,
    //Thickness Number 3:
    SpaceGrotesk_500Medium,
    //Thickness Number 4:
    SpaceGrotesk_600SemiBold,
    //Thickness Number 5:
    SpaceGrotesk_700Bold,
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<null | boolean>(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then(async (value) => {
      if (value == null) {
        setIsFirstLaunch(true);
        tabBarRef.current.setVisible(false);
      } else {
        setIsFirstLaunch(false);
        tabBarRef.current.setVisible(true);
      }
    });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    //IMPORTANT: THIS DELAY IS HERE BECAUSE I COULDN'T FIGURE OUT HOW TO USE THE ONLAYOUTROOTVIEW
    // FUNCTION W/O HAVING A VIEW COMPONENT AS THE PARENT COMPONENT TO EVERYTHING ELSE.
    // INSTEAD, I CALL THE FUNCTION MANUALLY AND THE DELAY SOMEWHAT MAKES SURE EVERYTHING IS ACTUALLY
    // RENDERED IN. I THINK THIS MAY BE CAUSING A DOUBLE RENDER BUT IDK
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(250);

    if (fontsLoaded && isFirstLaunch != null) {
      if (isFirstLaunch) {
        tabBarRef?.current?.setVisible(false);
      } else if (!isFirstLaunch) {
        tabBarRef?.current?.setVisible(true);
      }
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  onLayoutRootView();

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
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <Pressable onPress={() => navigate(routeName)} style={styles.tabbarItem}>
        {_renderIcon(routeName, selectedTab)}
      </Pressable>
    );
  };

  if (isFirstLaunch == null || !fontsLoaded) {
    return null;
  } else {
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
                  tabBarRef?.current?.setVisible(false);
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
        </CurvedBottomBarExpo.Navigator>
      </NavigationContainer>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {
    zIndex: 999,
    backgroundColor: "#0000",
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 19,
    elevation: 15,
    // background color must be set
    backgroundColor: "#0000",
  },
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
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default App;
