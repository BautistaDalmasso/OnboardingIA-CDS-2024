import { NavigationProp, useIsFocused } from "@react-navigation/native";
import { Camera, CameraType, FlashMode } from "expo-camera/legacy";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, StyleSheet, Text } from "react-native";
import React from "react";

interface Props {
  navigation: NavigationProp<any, any>;
}
const CaptureQR = ({ navigation }: Props) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [cameraType] = useState(CameraType.back);
  const [flash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (!hasCameraPermission) {
    return (
      <View>
        <Text>Necesitamos permiso para utilizar tu camara.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
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
      )}
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
