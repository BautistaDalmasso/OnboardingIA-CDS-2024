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
import {
  View,
  StyleSheet,
  Text,
  Alert,
  AlertButton,
  TouchableOpacity,
} from "react-native";
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

  const [scanPaused, setPauseScan] = useState(false);
  const [barcodeData, setBarcodeData] = useState<number | null>(null);

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

    setBarcodeData(parseInt(scanningResult.data));
  };

  const confirmReturn = async () => {
    const result = await markBookAsReturned(barcodeData as number, alertButton);

    if (result) {
      onBookReturnFinished();
    } else {
      setPauseScan(false);
    }
  };

  const alertButton: AlertButton[] = [
    {
      text: "OK",
      onPress: () => setPauseScan(false),
      style: "cancel",
    },
  ];

  if (barcodeData) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Marcando Devolución</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Libro: {barcodeData}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmReturn}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setBarcodeData(null);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
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
              <Text style={styles.streakText}>
                Esperando Código de Barras...
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.largeButton}
            onPress={onBookReturnFinished}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
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

export default ScanReturnedBook;
