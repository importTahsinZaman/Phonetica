import React, { createRef } from "react"; // <== import createRef
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
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

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const Stack = createNativeStackNavigator();

export const tabBarRef: any = createRef(); // <== Call this function to hide tabbar tabBarRef?.current?.setVisible(false);

const App = () => {
  const _renderIcon = (routeName, selectedTab) => {
    const ICON_SIZE = PAGE_WIDTH * 0.08;

    let color = "8D8D8D";

    if (routeName === selectedTab) {
      color = "#FFBF23";
    }

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

  return (
    <NavigationContainer>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        ref={tabBarRef}
        style={styles.bottomBar}
        height={PAGE_HEIGHT * 0.08}
        bgColor="white"
        initialRouteName="Home"
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
              <ScanIcon width={PAGE_WIDTH * 0.08} height={PAGE_WIDTH * 0.08} />
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
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="TextSelect" component={TextSelectScreen} />
        <Stack.Screen name="Translation" component={TranslationScreen} />
      </CurvedBottomBarExpo.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {
    shadowColor: "black",
    shadowRadius: 19,
    shadowOpacity: 0.1,
  },
  btnCircleUp: {
    width: PAGE_WIDTH * 0.18666666666,
    height: PAGE_WIDTH * 0.18666666666,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbf23",
    bottom: PAGE_HEIGHT * 0.067, //TODO: FIX THIS VALUE
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
