import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  BarCodeScanningResult,
  Camera,
  CameraType,
  FlashMode,
} from "expo-camera/legacy";
import { useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, StyleSheet, Text, Alert, AlertButton } from "react-native";
import React from "react";
import useScanBarcodes from "../../hooks/useScanBarcodes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IDniData } from "../../common/interfaces/User";

interface ScanForDniProps {
    onDniScanned: (dni: IDniData) => void;
    onCancel: () => void;
}

const ScanDni = ({ onDniScanned, onCancel }: ScanForDniProps) => {
  const { getDniData } = useScanBarcodes();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [cameraType] = useState(CameraType.back);
  const [flash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  const [scanPaused, setPauseScan] = useState(false);

  const [dni, setDni] = useState("");


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

    const scanningResultType = scanningResult.type as unknown as number;
    if (scanningResultType === 2048) {
        handleDniScan(scanningResult)
    }
    else {
        console.log(typeof scanningResult.type);
        console.log(scanningResult.type);
        Alert.alert(
          "Error",
          "Tipo de código de barras desconocido.",
          alertButton,
        );
    }
  };

  const handleDniScan = async (scanningResult: BarCodeScanningResult) => {
    onDniScanned(await getDniData(scanningResult.data));
  }

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

  return (
    <View style={styles.cameraContainer}>
      {isFocused && (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          flashMode={flash}
          onBarCodeScanned={async (scanningResult) => {
            await onScan(scanningResult);
          }}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.streakContainer}>
          <View style={[styles.streak, styles.waitingStreak]}>
              <Text style={styles.streakText}>Escanee el código de barras frontal de su DNI...</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.largeButton}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dataContainer: {
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#9ACD32",
    borderRadius: 5,
    padding: 15,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    padding: 15,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  streakContainer: {
    marginBottom: 10,
  },
  streak: {
    backgroundColor: "#006694",
    borderRadius: 50,
    marginBottom: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  waitingStreak: {
    backgroundColor: "#ddd",
  },
  obtainedStreak: {
    backgroundColor: "#9ACD32",
  },
  streakText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  largeButton: {
    backgroundColor: "#006694",
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    width: "90%",
  },
});

export default ScanDni;
