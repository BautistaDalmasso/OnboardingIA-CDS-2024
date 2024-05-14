import * as FileSystem from "expo-file-system";

import { useContextState } from "../ContexState";
import { DownloadQrService } from "../services/downloadQrService";
import useOfflineStorage from "./useOfflineStorage";
import { IUser } from "../common/interfaces/User";
import { QrToggle } from "../common/interfaces/QrCodeInfo";

const useQr = () => {
  const { contextState, setContextState } = useContextState();
  const { getLastQrCodeInfo, saveLastQrCodeInfo, getLastUser } =
    useOfflineStorage();

  const getQrURI = async () => {
    const lastUser = await getLastUser();
    const lastQrCodeInfo = await getLastQrCodeInfo();

    if (lastUser === null) {
      throw new Error("No user has logged in this device.");
    }
    if (lastQrCodeInfo === null) {
      throw new Error("No user has obtained a qr in this device.");
    }
    if (lastUser.email !== lastQrCodeInfo.userEmail) {
      throw new Error("Last user hasn't obtained a qr in this device.");
    }

    return FileSystem.documentDirectory + lastQrCodeInfo.toggle + "qr.png";
  };

  const updateQrCode = async (access_token: string, user: IUser) => {
    if (user.dni === null) {
      return;
    }
    let newToggle = QrToggle.A;

    const lastQrCodeInfo = await getLastQrCodeInfo();

    if (lastQrCodeInfo !== null) {
      newToggle =
        lastQrCodeInfo.toggle === QrToggle.A ? QrToggle.B : QrToggle.A;
    }

    const wasUpdated = await DownloadQrService.updateQrCode(
      user,
      lastQrCodeInfo,
      access_token,
      newToggle,
    );

    if (wasUpdated) {
      saveLastQrCodeInfo(user, newToggle);
    }
  };

  return {
    getQrURI,
    updateQrCode,
  };
};

export default useQr;
