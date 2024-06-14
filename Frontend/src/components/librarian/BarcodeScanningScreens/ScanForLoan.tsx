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
import useScanBarcodes from "../../../hooks/useScanBarcodes";
import { IQrCodeInfo } from "../../../common/interfaces/User";
import { TouchableOpacity } from "react-native-gesture-handler";
import useLoanCreation from "../../../hooks/useLoanCreation";
import { IBookWithLicence } from "../../../common/interfaces/Book";

interface ScanForLoanProps {
  onBookLoanFinished: () => void;
}

const ScanForLoan = ({ onBookLoanFinished }: ScanForLoanProps) => {
  const { verifyBookInventoryBarcode, getQrCodeInfo, getBook } =
    useScanBarcodes();
  const { assignLoan } = useLoanCreation();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [cameraType] = useState(CameraType.back);
  const [flash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  const [scanPaused, setPauseScan] = useState(false);

  const [qrData, setQrData] = useState<IQrCodeInfo | null>(null);
  const [inventoryNumberFromBarcode, setInventoryNumberFromBarcode] = useState<
    number | null
  >(null);
  const [scannedBook, setScannedBook] = useState<IBookWithLicence | null>(null);

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
    switch (scanningResultType) {
      case 2:
        if (inventoryNumberFromBarcode) {
          setPauseScan(false);
          return;
        }
        await handleBarcode(scanningResult);
        break;
      case 256:
        if (qrData) {
          setPauseScan(false);
          return;
        }
        handleQr(scanningResult);
        break;
      default:
        console.log(typeof scanningResult.type);
        Alert.alert(
          "Error",
          "Tipo de código de barras desconocido.",
          alertButton,
        );
    }
  };

  const handleBarcode = async (scanningResult: BarCodeScanningResult) => {
    if (!verifyBookInventoryBarcode(scanningResult)) {
      Alert.alert(
        "Error escaneando el código de barras",
        "Código de barras no es de un formato conocido.",
        alertButton,
      );
      return;
    }

    const inventoryNumber = parseInt(scanningResult.data);
    const book = await getBook(inventoryNumber);

    if (book !== null) {
      setInventoryNumberFromBarcode(inventoryNumber);
      setScannedBook(book);
    } else {
      Alert.alert(
        "Error Escaneando Número de Inventario",
        `Libro con código de inventario "${inventoryNumber}" desconocido.`,
        alertButton,
      );
    }
  };

  const handleQr = (scanningResult: BarCodeScanningResult) => {
    const qrCodeInfo = getQrCodeInfo(scanningResult);

    if (qrCodeInfo === null) {
      Alert.alert(
        "Error escaneando Código QR",
        "Código QR no es de un formato conocido.",
        alertButton,
      );
      return;
    }

    setQrData(qrCodeInfo);
    setPauseScan(false);
  };

  const alertButton: AlertButton[] = [
    {
      text: "OK",
      onPress: () => setPauseScan(false),
      style: "cancel",
    },
  ];

  const confirmLoan = async () => {
    const result = await assignLoan(
      inventoryNumberFromBarcode as number,
      (qrData as IQrCodeInfo).email,
    );

    if (result) {
      onBookLoanFinished();
    }
  };

  if (!hasCameraPermission) {
    return (
      <View>
        <Text>Necesitamos permiso para utilizar tu camara.</Text>
      </View>
    );
  }

  if (qrData && inventoryNumberFromBarcode) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Creando Préstamo</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Usuario: {qrData.email}</Text>
          <Text style={styles.dataText}>
            Libro: {scannedBook?.book_data.title}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={confirmLoan}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setInventoryNumberFromBarcode(null);
              setQrData(null);
              setPauseScan(false);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
          {qrData ? (
            <View style={[styles.streak, styles.obtainedStreak]}>
              <Text style={styles.streakText}>
                Usuario: {qrData.first_name} {qrData.last_name}
              </Text>
            </View>
          ) : (
            <View style={[styles.streak, styles.waitingStreak]}>
              <Text style={styles.streakText}>Esperando QR con Carnet...</Text>
            </View>
          )}
          {inventoryNumberFromBarcode ? (
            <View style={[styles.streak, styles.obtainedStreak]}>
              <Text style={styles.streakText}>
                {scannedBook?.book_data.title}
              </Text>
            </View>
          ) : (
            <View style={[styles.streak, styles.waitingStreak]}>
              <Text style={styles.streakText}>
                Esperando Código de Barras...
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.largeButton}
          onPress={onBookLoanFinished}
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

export default ScanForLoan;
