import React from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";

import HomeIcon from "./app/assets/HomeIcon.svg";
import LearnIcon from "./app/assets/LearnIcon.svg";
import ScanIcon from "./app/assets/ScanIcon.svg";

import HomeScreen from "./app/screens/HomeScreen";
import LearnPage from "./app/components/LearnPage";

const App = () => {
  const _renderIcon = (routeName, selectedTab) => {
    let color = "8D8D8D";

    if (routeName === selectedTab) {
      color = "#FFBF23";
    }

    switch (routeName) {
      case "Home":
        return (
          <HomeIcon
            width={120}
            height={40}
            style={{ color: routeName === selectedTab ? "#FFBF23" : "#8D8D8D" }}
          />
        );
        break;
      case "Learn":
        return (
          <LearnIcon
            width={120}
            height={40}
            style={{ color: routeName === selectedTab ? "#FFBF23" : "#8D8D8D" }}
          />
        );
        break;
    }
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <NavigationContainer>
      <CurvedBottomBarExpo.Navigator
        type="DOWN"
        style={styles.bottomBar}
        // shadowStyle={styles.shadow}
        height={74}
        circleWidth={60}
        bgColor="white"
        initialRouteName="Home"
        screenOptions={{
          header: () => null,
        }}
        borderTopLeftRight
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("Click Action")}
            >
              <ScanIcon width={25} height={25} />
            </TouchableOpacity>
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
          component={LearnPage}
          position="RIGHT"
        />
      </CurvedBottomBarExpo.Navigator>
    </NavigationContainer>
  );
};

export const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 19,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbf23",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: "gray",
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
