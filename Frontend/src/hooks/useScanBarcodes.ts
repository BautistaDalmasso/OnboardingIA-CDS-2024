import { BarCodeScanningResult } from "expo-camera/legacy";
import { IDniData, IQrCodeInfo } from "../common/interfaces/User";
import { LibraryService } from "../services/LibraryService";

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

  const getBook = async (inventoryNumber: number) => {
    const book = await LibraryService.getBookByInventoryNumber(inventoryNumber);

    return book;
  };

  const getDniData = async (barcodeData: string): Promise<IDniData> => {
    const splitData = barcodeData.split("@")
    return {

        lastName: splitData[1],
        firstName: splitData[2],
        gender: splitData[3],
        dni: splitData[4],
        exemplar: splitData[5],
        birthDay: splitData[6],
        expirationDay: splitData[7],
        number: splitData[8],
    };
  }

  return {
    verifyBookInventoryBarcode,
    getQrCodeInfo,
    getBook,
    getDniData,
  };
};

export default useScanBarcodes;
