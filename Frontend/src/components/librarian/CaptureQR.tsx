import { useIsFocused } from "@react-navigation/native";
import { BarCodeScanningResult, Camera, CameraType, FlashMode } from "expo-camera/legacy";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, StyleSheet, Text } from "react-native";
import React from "react";


interface CaptureQrProps {
  onScan: (scanningResult: BarCodeScanningResult) => void;
}
const CaptureQR = ({ onScan }: CaptureQrProps) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [cameraType] = useState(CameraType.back);
  const [flash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);
  const [scanResult, setScanResult] = useState("");

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
    <>
      {
        isFocused && (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              type={cameraType}
              ref={cameraRef}
              flashMode={flash}
              barCodeScannerSettings={{
                barCodeTypes: ["qr"],
              }}
              onBarCodeScanned={async (scanningResult) => {
                await onScan(scanningResult);
              }}
            />
          </View>
        )
        }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  cameraContainer: {
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
