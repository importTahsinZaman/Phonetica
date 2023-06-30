import {
  Button,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import TakePictureButtonSvg from "../assets/TakePictureButton.svg";
import ReturnHeader from "../components/ReturnHeader";
import { ImageEditor } from "@tahsinz21366/expo-crop-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tabBarRef } from "../components/HelperFunctions";
import { useIsFocused } from "@react-navigation/native";

import Constants, { ExecutionEnvironment } from "expo-constants";

// `true` when running in Expo Go.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let analytics;

let rewardedInterstitial;

const { TestIds, AdEventType, RewardedInterstitialAd, RewardedAdEventType } =
  !isExpoGo ? require("react-native-google-mobile-ads") : "";

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  analytics = require("@react-native-firebase/analytics").default;

  rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
    TestIds.REWARDED_INTERSTITIAL,
    {
      requestNonPersonalizedAdsOnly: true,
    }
  );
}

type Props = {
  navigation: any; //TODO: FIX THIS
};

const PAGE_WIDTH = Dimensions.get("window").width;

const AD_FREQUENCY = 3; // Ads are shown every AD_FREQUENCY number of scans

const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const [editorVisible, setEditorVisible] = useState(false);
  const scanCount = useRef(1);
  const [rewardedInterstitialLoaded, setRewardedInterstitialLoaded] =
    useState(false);
  const adCompletedRef = useRef(false);
  const imageBase64 = useRef("");

  let camera: any = null;

  const updateScanCount = async () => {
    console.log("Old scan count: ", scanCount.current);
    let newScanCount = scanCount.current;
    if (scanCount.current + 1 > AD_FREQUENCY) {
      newScanCount = 1;
    } else {
      newScanCount = scanCount.current + 1;
    }
    console.log("New Scan Count: ", newScanCount);
    await AsyncStorage.setItem("ScanCount", newScanCount.toString());
  };

  const loadRewardedInterstitial = () => {
    if (!isExpoGo) {
      const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setRewardedInterstitialLoaded(true);
        }
      );

      const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        async () => {
          adCompletedRef.current = true;
          console.log("Completed Ad");
        }
      );

      const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
        AdEventType.CLOSED,
        async () => {
          console.log("Ad is completed: ", adCompletedRef.current);
          if (adCompletedRef.current) {
            console.log("AD HAS BEEN COMPLETED YAYYYY");
            updateScanCount();
            setEditorVisible(false);

            navigation.navigate("TextSelect", {
              base64: imageBase64.current,
              ReturnHome: false,
            });
          } else {
            console.log("Cancelled Ad");
            setEditorVisible(false);
            tabBarRef?.current?.setVisible(true);
            navigation.navigate("Home");
          }
        }
      );

      rewardedInterstitial.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
      };
    }
  };

  useEffect(() => {
    adCompletedRef.current = false;
    if (isFocused) {
      console.log("AD is already completed: ", adCompletedRef.current);
      let retrievedScanCount: number;
      const checkIfAdLoadNeeded = async () => {
        await AsyncStorage.getItem("ScanCount").then((result) => {
          retrievedScanCount = parseInt(result);
          scanCount.current = retrievedScanCount;
        });

        console.log("Retrieved Scan Count:", retrievedScanCount);
        console.log(
          "Ad load requirements met: ",
          !isExpoGo && retrievedScanCount == AD_FREQUENCY - 1
        );

        if (!isExpoGo && retrievedScanCount == AD_FREQUENCY - 1) {
          console.log("Loading ad...");
          const unsubscribeRewardedInterstitialEvents =
            loadRewardedInterstitial();

          return () => {
            unsubscribeRewardedInterstitialEvents();
          };
        } else {
          //just set to true when not needed
          setRewardedInterstitialLoaded(true);
        }
      };
      checkIfAdLoadNeeded();
    }
  }, [isFocused]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 justify-center">
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePicture = async () => {
    await camera.takePictureAsync().then(async (r) => {
      setImageUri(r.uri);
      setEditorVisible(true);
    });
  };

  if (!rewardedInterstitialLoaded) {
    return (
      <SafeAreaView className="w-full h-full flex flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#FFBF23" />
      </SafeAreaView>
    );
  }

  return (
    <View
      className="flex-1 justify-center"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {!editorVisible && (
        <Camera
          type={type}
          className="flex-1"
          ref={(r) => {
            camera = r;
          }}
        >
          <SafeAreaView>
            <ReturnHeader navigation={navigation}></ReturnHeader>
          </SafeAreaView>

          <SafeAreaView className="flex-1 flex-row bg-transparent m-[64]">
            <TouchableOpacity
              onPress={takePicture}
              className="flex-1 self-end items-center"
            >
              <TakePictureButtonSvg
                width={PAGE_WIDTH * 0.1973333333333333333}
                height={PAGE_WIDTH * 0.1973333333333333333}
              ></TakePictureButtonSvg>
            </TouchableOpacity>
          </SafeAreaView>
        </Camera>
      )}
      {editorVisible && (
        <ImageEditor
          isVisible={editorVisible}
          imageUri={imageUri}
          fixedAspectRatio={777}
          editorOptions={{
            controlBar: {
              position: "bottom",
            },
          }}
          minimumCropDimensions={{
            width: 50,
            height: 50,
          }}
          onEditingCancel={() => {
            setEditorVisible(false);
          }}
          onEditingComplete={async (r) => {
            if (isExpoGo) {
              console.log("scanned image");
            } else {
              await analytics().logEvent("scanned_image");
            }

            await manipulateAsync(r.uri, [], {
              compress: 0.7,
              format: SaveFormat.JPEG,
              base64: true,
            }).then((result) => {
              imageBase64.current = result.base64;
              if (scanCount.current == AD_FREQUENCY - 1 && !isExpoGo) {
                console.log("Showing ad....");
                rewardedInterstitial.show();
              } else {
                updateScanCount();
                setEditorVisible(false);

                navigation.navigate("TextSelect", {
                  base64: result.base64,
                  ReturnHome: false,
                });
              }
            });
          }}
        />
      )}
    </View>
  );
};

export default ScanScreen;
