import * as FileSystem from "expo-file-system";

import { useContextState } from "../ContexState";
import { DownloadQrService } from "../services/downloadQrService";
import useOfflineStorage from "./useOfflineStorage";
import { IUser } from "../common/interfaces/User";

const useQr = () => {
  const { contextState, setContextState } = useContextState();
  const { getLastQrCodeInfo, saveLastQrCodeInfo, getLastUser } =
    useOfflineStorage();

  const qrCodeURI = FileSystem.documentDirectory + "qr.png";

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

    return qrCodeURI;
  };

  const updateQrCode = async (access_token: string, user: IUser) => {
    console.log(user.dni);

    if (user.dni === null) {
      return;
    }
    const lastQrCodeInfo = await getLastQrCodeInfo();

    const wasUpdated = await DownloadQrService.updateQrCode(
      user,
      lastQrCodeInfo,
      access_token,
    );

    if (wasUpdated) {
      saveLastQrCodeInfo(user);
    }
  };

  return {
    getQrURI,
    updateQrCode,
  };
};

export default useQr;
