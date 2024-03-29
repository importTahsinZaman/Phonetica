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
  Modal,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import TakePictureButtonSvg from "../assets/TakePictureButton.svg";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ReturnHeader from "../components/ReturnHeader";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "@tahsinz21366/expo-crop-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tabBarRef } from "../components/HelperFunctions";
import { useIsFocused } from "@react-navigation/native";
import CustomText from "../components/CustomText";

import Constants, { ExecutionEnvironment } from "expo-constants";
import {
  trackingPermissionPromise,
  adTrackingGranted,
} from "../components/HelperFunctions";

import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";

const IMAGE_COMPRESSION_AMOUNT = 0.7;
const IMAGE_SAVE_FORMAT = SaveFormat.JPEG;

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
        let AD_ID = TestIds.REWARDED_INTERSTITIAL;
        if (__DEV__) {
          AD_ID = TestIds.REWARDED_INTERSTITIAL;
        } else {
          if (Platform.OS === "ios") {
            AD_ID = "ca-app-pub-6289844451431860/4650586365";
          } else {
            AD_ID = "ca-app-pub-6289844451431860/8279728235"; //ANDROID ADS DON'T GET CALLED BC WAITING FOR APP VERIFICATION FROM AD MOB
          }
        }
        rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
          AD_ID,
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
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [
    mediaLibraryPermissionModalVisible,
    setMediaLibraryPermissionModalVisible,
  ] = useState(false);
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
      tabBarRef?.current?.setVisible(false);
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

  // Redirect the user to the app's settings page
  const redirectToSettings = () => {
    if (Platform.OS === "android") {
      // For Android, use the IntentLauncherAndroid module
      IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_SETTINGS
      );
    } else {
      // For iOS, use the Linking module
      Linking.openURL("app-settings:");
    }
  };

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 bg-black">
        <ReturnHeader navigation={navigation}></ReturnHeader>
        <View className="flex-1 justify-center text-center">
          <Text
            style={{
              textAlign: "center",
              color: "white",
              marginHorizontal: 50,
            }}
          >
            We need your permission to show the camera so you can scan text!
          </Text>
          <Button
            onPress={() => {
              if (permission.canAskAgain) {
                requestPermission();
              } else {
                redirectToSettings();
              }
            }}
            title={permission.canAskAgain ? "continue" : "open settings"}
          />
        </View>
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

  const handleImageButton = () => {
    if (mediaLibraryPermission?.granted) {
      pickImage();
    } else if (!mediaLibraryPermission?.granted) {
      if (mediaLibraryPermission?.canAskAgain) {
        requestMediaLibraryPermission();
      } else {
        setMediaLibraryPermissionModalVisible(true);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result["assets"][0].uri);
      setEditorVisible(true);
    }
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

          <SafeAreaView className="bg-transparent flex-end flex-1">
            <View
              className="flex-row bg-transparent w-full items-center absolute bottom-16"
              style={{ height: PAGE_WIDTH * 0.1973333333333333333 }}
            >
              <TouchableOpacity
                onPress={handleImageButton}
                className="flex-1 items-center h-full justify-center"
              >
                <Ionicons
                  name="images"
                  size={PAGE_WIDTH * 0.085}
                  color="white"
                ></Ionicons>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePicture}
                className="flex-1 items-center h-full justify-center"
              >
                <TakePictureButtonSvg
                  width={PAGE_WIDTH * 0.1973333333333333333}
                  height={PAGE_WIDTH * 0.1973333333333333333}
                ></TakePictureButtonSvg>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleCameraType}
                className="flex-1 items-center h-full justify-center"
              >
                <MaterialIcons
                  name="switch-camera"
                  size={PAGE_WIDTH * 0.085}
                  color="white"
                ></MaterialIcons>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Camera>
      )}
      {editorVisible && (
        <ImageEditor
          isVisible={editorVisible}
          imageUri={imageUri}
          fixedAspectRatio={777}
          editorOptions={{
            backgroundColor: "black",
            controlBar: {
              position: "bottom",
              backgroundColor: "white",
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
              compress: IMAGE_COMPRESSION_AMOUNT,
              format: IMAGE_SAVE_FORMAT,
              base64: true,
            }).then((result) => {
              imageBase64.current = result.base64;
              if (
                scanCount.current == AD_FREQUENCY - 1 &&
                !isExpoGo &&
                Platform.OS === "ios"
              ) {
                //ADS DISABLED FOR ANDROID FOR NOW ^^^^
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
      {mediaLibraryPermissionModalVisible && (
        <Modal
          visible={mediaLibraryPermissionModalVisible}
          transparent={true}
          onRequestClose={() => {
            setMediaLibraryPermissionModalVisible(false);
          }}
        >
          <SafeAreaView className="bg-[#000000a3] flex-1 flex items-center justify-center">
            <View className=" bg-[#ffffff] mx-[45] rounded-lg p-4 py-6">
              <CustomText className=" text-center">
                Phonetica needs your permission to scan photos from your camera
                roll
              </CustomText>

              <View className="flex flex-row pt-5">
                <TouchableOpacity
                  onPress={() => {
                    setMediaLibraryPermissionModalVisible(false);
                  }}
                  className="grow items-center"
                >
                  <CustomText className="text-[#FFBF23] ">Close</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMediaLibraryPermissionModalVisible(false);
                    redirectToSettings();
                  }}
                  className="grow items-center"
                >
                  <CustomText className="text-[#FFBF23]">Settings</CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

export default ScanScreen;
