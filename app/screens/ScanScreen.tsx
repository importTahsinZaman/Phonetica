import {
  Button,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import TakePictureButtonSvg from "../assets/TakePictureButton.svg";
import ReturnHeader from "../components/ReturnHeader";
import { ImageEditor } from "expo-image-editor";

type Props = {
  navigation: any; //TODO: FIX THIS
};

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;

const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imageUri, setImageUri] = useState(undefined);
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
      launchEditor(r.uri);
    });
  };

  const launchEditor = (uri: string) => {
    // Then set the image uri
    setImageUri(uri);
    // And set the image editor to be visible
    setEditorVisible(true);
  };

  return (
    <View
      className="flex-1 justify-center"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
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
          <ImageEditor
            visible={editorVisible}
            onCloseEditor={() => setEditorVisible(false)}
            imageUri={imageUri}
            fixedCropAspectRatio={16 / 9}
            lockAspectRatio={false}
            minimumCropDimensions={{
              width: 100,
              height: 100,
            }}
            onEditingComplete={async (r) => {
              const manipResult = await manipulateAsync(r.uri, [], {
                compress: 0.7,
                format: SaveFormat.JPEG,
                base64: true,
              });
              navigation.navigate("TextSelect", {
                base64: manipResult.base64,
                ReturnHome: false,
              });
            }}
            mode="crop-only"
          />

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
