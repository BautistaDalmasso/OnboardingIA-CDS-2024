import { NavigationProp } from "@react-navigation/native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, StyleSheet } from "react-native";
import React from "react";

interface Props {
  navigation: NavigationProp<any, any>;
}

const CaptureQR = ({ navigation }: Props) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [image, setImage] = useState<string>("");
  const [cameraType, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
        ref={cameraRef}
        flashMode={flash}
        barCodeScannerSettings={{
          barCodeTypes: ["qr"],
        }}
        onBarCodeScanned={(scanningResult) => {
          console.log(scanningResult);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
    padding: 8,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
});

export default CaptureQR;
