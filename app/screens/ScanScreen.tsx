import { StatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import TakePictureButtonSvg from "../assets/TakePictureButton.svg";
import ReturnHeader from "../components/ReturnHeader";

type Props = {
  navigation: any; //TODO: FIX THIS
};

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

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
      const manipResult = await manipulateAsync(
        r.uri,
        [{ resize: { height: 1100 } }],
        {
          compress: 1,
          format: SaveFormat.JPEG,
          base64: true,
        }
      );

      navigation.navigate("TextSelect", manipResult);
    });
  };

  return (
    <View className="flex-1 justify-center">
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
    </View>
  );
};

export default ScanScreen;
