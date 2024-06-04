import { BarCodeScanningResult } from "expo-camera/legacy";

const useScanBarcodes = () => {
  const verifyBookInventoryBarcode = (
    scanningResult: BarCodeScanningResult,
  ) => {
    return scanningResult.data.length === 8;
  };

  return {
    verifyBookInventoryBarcode,
  };
};

export default useScanBarcodes;
