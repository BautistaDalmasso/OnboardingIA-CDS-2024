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
import { IQrCodeInfo } from "../../../common/interfaces/User";
import { TouchableOpacity } from "react-native-gesture-handler";
import useLoanCreation from "../../../hooks/useLoanCreation";

interface ScanForLoanProps {
  onBookLoanFinished: () => void;
}

const ScanForLoan = ({ onBookLoanFinished }: ScanForLoanProps) => {
  const { verifyBookInventoryBarcode, getQrCodeInfo } = useScanBarcodes();
  const { assignLoan } = useLoanCreation();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const isFocused = useIsFocused();
  const [cameraType] = useState(CameraType.back);
  const [flash] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  const [manualEntry, setManualEntry] = useState(false);
  const [scanPaused, setPauseScan] = useState(false);

  const [qrData, setQrData] = useState<IQrCodeInfo | null>(null);
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

    const scanningResultType = scanningResult.type as unknown as number;
    switch (scanningResultType) {
      case 2:
        if (barcodeData) {
          setPauseScan(false);
          return;
        }
        handleBarcode(scanningResult);
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

  const handleBarcode = (scanningResult: BarCodeScanningResult) => {
    if (!verifyBookInventoryBarcode(scanningResult)) {
      Alert.alert(
        "Error escaneando el código de barras",
        "Código de barras no es de un formato conocido.",
        alertButton,
      );
      return;
    }

    setBarcodeData(parseInt(scanningResult.data));
    setPauseScan(false);
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
      barcodeData as number,
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

  if (manualEntry) {
    return <></>;
  }

  if (qrData && barcodeData) {
    return (
      <View style={{ margin: 60 }}>
        <Text>
          Prestandole libro {barcodeData} a {qrData.first_name}{" "}
          {qrData.last_name}.
        </Text>
        <TouchableOpacity onPress={confirmLoan}>
          <Text>Confirmar</Text>
        </TouchableOpacity>
      </View>
    );
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

export default ScanForLoan;
