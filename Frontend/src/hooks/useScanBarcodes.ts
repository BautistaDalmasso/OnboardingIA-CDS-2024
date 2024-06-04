import { BarCodeScanningResult } from "expo-camera/legacy";
import { IQrCodeInfo } from "../common/interfaces/User";

const useScanBarcodes = () => {
  const verifyBookInventoryBarcode = (
    scanningResult: BarCodeScanningResult,
  ) => {
    return scanningResult.data.length === 8;
  };

  const getQrCodeInfo = (scanningResult: BarCodeScanningResult) => {
    const qrCodeInfo: IQrCodeInfo = JSON.parse(scanningResult.data);

    try {
      if (
        typeof qrCodeInfo.email === "string" &&
        typeof qrCodeInfo.first_name === "string" &&
        typeof qrCodeInfo.last_name === "string" &&
        typeof qrCodeInfo.dni === "string" &&
        typeof qrCodeInfo.licence_level === "number"
      ) {
        return qrCodeInfo;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  return {
    verifyBookInventoryBarcode,
    getQrCodeInfo,
  };
};

export default useScanBarcodes;
