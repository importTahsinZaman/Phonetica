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

import { getTrackingPermissionsAsync } from "expo-tracking-transparency";

import Constants, { ExecutionEnvironment } from "expo-constants";
import {
  trackingPermissionPromise,
  adTrackingGranted,
} from "../components/HelperFunctions";

// `true` when running in Expo Go.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let analytics, rewardedInterstitial;

const mobileAds = !isExpoGo
  ? require("react-native-google-mobile-ads").default
  : "";
const {
  MaxAdContentRating,
  TestIds,
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
} = !isExpoGo ? require("react-native-google-mobile-ads") : "";

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  analytics = require("@react-native-firebase/analytics").default;

  mobileAds()
    .setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.PG,

      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: true,

      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: true,
    })
    .then(() => {
      trackingPermissionPromise.then(() => {
        rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
          TestIds.REWARDED_INTERSTITIAL,
          {
            requestNonPersonalizedAdsOnly: !adTrackingGranted,
          }
        );
      });
    });
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
    let newScanCount = scanCount.current;
    if (scanCount.current + 1 > AD_FREQUENCY) {
      newScanCount = 1;
    } else {
      newScanCount = scanCount.current + 1;
    }
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
        }
      );

      const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
        AdEventType.CLOSED,
        async () => {
          if (adCompletedRef.current) {
            updateScanCount();
            setEditorVisible(false);

            navigation.navigate("TextSelect", {
              base64: imageBase64.current,
              ReturnHome: false,
            });
          } else {
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
      let retrievedScanCount: number;
      const checkIfAdLoadNeeded = async () => {
        await AsyncStorage.getItem("ScanCount").then((result) => {
          retrievedScanCount = parseInt(result);
          scanCount.current = retrievedScanCount;
        });

        if (!isExpoGo && retrievedScanCount == AD_FREQUENCY - 1) {
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
            backgroundColor: "#f2f2f2",
            controlBar: {
              position: "bottom",
              backgroundColor: "white",
              // height: 85,
              cropButton: {
                text: "crop",
                color: "#8D8D8D",
                iconName: "crop",
              },
              cancelButton: {
                text: "cancel",
                color: "#8D8D8D",
                iconName: "cancel",
              },
              backButton: {
                text: "cancel",
                color: "#8D8D8D",
                iconName: "arrow-back",
              },
              saveButton: {
                text: "cancel",
                color: "#8D8D8D",
                iconName: "check",
              },
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
