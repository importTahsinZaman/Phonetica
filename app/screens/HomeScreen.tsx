import { StatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

type Props = {
  navigation: any; //FIX THIS
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
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
      const manipResult = await manipulateAsync(r.uri, [], {
        compress: 0.4,
        format: SaveFormat.JPEG,
        base64: true,
      });
      navigation.navigate("OCR", manipResult);
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
        <View className="flex-1 flex-row bg-transparent m-[64]">
          <TouchableOpacity
            onPress={toggleCameraType}
            className="flex-1 self-end items-center"
          >
            <Text className="text-xl font-bold text-white">Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePicture}
            className="flex-1 self-end items-center"
          >
            <Text className="text-xl font-bold text-white">Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default HomeScreen;
