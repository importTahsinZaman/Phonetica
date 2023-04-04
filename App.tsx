import React from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import { NavigationContainer } from "@react-navigation/native";

import HomeIcon from "./app/assets/HomeIcon.svg";
import LearnIcon from "./app/assets/LearnIcon.svg";
import ScanIcon from "./app/assets/ScanIcon.svg";

import HomeScreen from "./app/screens/HomeScreen";
import LearnPage from "./app/components/LearnPage";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const App = () => {
  const _renderIcon = (routeName, selectedTab) => {
    const ICON_WIDTH = PAGE_WIDTH * 0.08;
    const ICON_HEIGHT = PAGE_HEIGHT * 0.03340757238;

    let color = "8D8D8D";

    if (routeName === selectedTab) {
      color = "#FFBF23";
    }

    switch (routeName) {
      case "Home":
        return (
          <HomeIcon
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
            style={{ color: routeName === selectedTab ? "#FFBF23" : "#8D8D8D" }}
          />
        );
        break;
      case "Learn":
        return (
          <LearnIcon
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
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
        height={PAGE_HEIGHT * 0.07572383073}
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
              <ScanIcon
                width={PAGE_WIDTH * 0.08}
                height={PAGE_HEIGHT * 0.03340757238}
              />
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

const styles = StyleSheet.create({
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
    width: PAGE_WIDTH * 0.18666666666,
    height: PAGE_WIDTH * 0.18666666666,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffbf23",
    bottom: PAGE_HEIGHT * 0.06904231625,
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
