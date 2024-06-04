import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  BarCodeScanningResult,
  Camera,
  CameraType,
  FlashMode,
} from "expo-camera/legacy";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, StyleSheet, Text, Alert, AlertButton } from "react-native";
import React from "react";
import useScanBarcodes from "../../../hooks/useScanBarcodes";
import useManageLoans from "../../../hooks/useManageLoans";

interface ScanReturnedBookProps {
  onBookReturnFinished: () => void;
}

const ScanReturnedBook = ({ onBookReturnFinished }: ScanReturnedBookProps) => {
  const { verifyBookInventoryBarcode } = useScanBarcodes();
  const { markBookAsReturned } = useManageLoans();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [cameraType] = useState(CameraType.back);
  const [flash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  const [manualEntry, setManualEntry] = useState(false);
  const [scanPaused, setPauseScan] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setPauseScan(false);

      return () => {};
    }, []),
  );

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const onScan = async (scanningResult: BarCodeScanningResult) => {
    if (scanPaused) {
      return;
    }

    setPauseScan(true);

    if (!verifyBookInventoryBarcode(scanningResult)) {
      Alert.alert(
        "Error escaneando el código de barras",
        "Código de barras no es de un formato conocido.",
        alertButton,
      );
      return;
    }

    const result = await markBookAsReturned(
      parseInt(scanningResult.data),
      alertButton,
    );

    if (result) {
      onBookReturnFinished();
    }
  };

  const alertButton: AlertButton[] = [
    {
      text: "OK",
      onPress: () => setPauseScan(false),
      style: "cancel",
    },
  ];

  if (!hasCameraPermission) {
    return (
      <View>
        <Text>Necesitamos permiso para utilizar tu camara.</Text>
      </View>
    );
  }

  if (manualEntry) {
    return <></>;
  }

  return (
    <>
      {isFocused && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={cameraType}
            ref={cameraRef}
            flashMode={flash}
            onBarCodeScanned={async (scanningResult) => {
              await onScan(scanningResult);
            }}
          />
        </View>
      )}
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

export default ScanReturnedBook;
