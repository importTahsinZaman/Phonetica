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
import { useEffect, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import TakePictureButtonSvg from "../assets/TakePictureButton.svg";
import ReturnHeader from "../components/ReturnHeader";
import { ImageEditor } from "expo-crop-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants, { ExecutionEnvironment } from "expo-constants";

// `true` when running in Expo Go.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let analytics;

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  analytics = require("@react-native-firebase/analytics").default;
}

type Props = {
  navigation: any; //TODO: FIX THIS
};

const PAGE_WIDTH = Dimensions.get("window").width;

const AD_FREQUENCY = 3; // Ads are shown every AD_FREQUENCY number of scans

const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const [editorVisible, setEditorVisible] = useState(false);

  let camera: any = null;

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
          fixedAspectRatio={3 / 2}
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

            const ScanCount = await AsyncStorage.getItem("ScanCount");

            let newScanCount;
            if (parseInt(ScanCount) + 1 > AD_FREQUENCY) {
              newScanCount = 1;
            } else {
              newScanCount = parseInt(ScanCount) + 1;
            }

            await AsyncStorage.setItem("ScanCount", newScanCount.toString());

            const manipResult = await manipulateAsync(r.uri, [], {
              compress: 0.7,
              format: SaveFormat.JPEG,
              base64: true,
            });

            setEditorVisible(false);

            navigation.navigate("TextSelect", {
              base64: manipResult.base64,
              ReturnHome: false,
            });
          }}
        />
      )}
    </View>
  );
};

export default ScanScreen;
