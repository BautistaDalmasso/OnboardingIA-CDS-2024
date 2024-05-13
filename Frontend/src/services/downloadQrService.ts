import * as FileSystem from "expo-file-system";

import { ServerAddress } from "../common/consts/serverAddress";
import { IUser } from "../common/interfaces/User";
import { OfflineStorageService } from "./offlineStorageService";

export class DownloadQrService {
  private static baseRoute: string = `${ServerAddress}qr`;
  private static qrCodeURI = FileSystem.documentDirectory + "qr.png";

  static async getQrOffline(): Promise<string> {
    const lastUser = await OfflineStorageService.getLastUser();
    const lastQrCodeInfo = await OfflineStorageService.getLastQrCodeInfo();

    if (lastUser === null) {
      throw new Error("No user has logged in this device.");
    }
    if (lastQrCodeInfo === null) {
      throw new Error("No user has obtained a qr in this device.");
    }
    if (lastUser.email !== lastQrCodeInfo.userEmail) {
      throw new Error("Last user hasn't obtained a qr in this device.");
    }

    return this.qrCodeURI;
  }

  static async updateQrCode(token: string): Promise<void> {
    const lastUser = await OfflineStorageService.getLastUser();
    const lastQrCodeInfo = await OfflineStorageService.getLastQrCodeInfo();

    console.log(lastUser);
    console.log(lastQrCodeInfo);
    if (lastUser === null) {
      throw Error("User hasn't logged in properly.");
    }

    // No qr code has been downloaded, or last qr code downloaded wasn't for this user
    // or last qr code downloaded requires an update.
    if (
      lastQrCodeInfo === null ||
      lastUser.email !== lastQrCodeInfo.userEmail ||
      lastUser.lastPermissionUpdate !== lastQrCodeInfo.lastUpdate
    ) {
      console.log("downloading qr");
      OfflineStorageService.saveLastQrCodeInfo(lastUser);
      await this.downloadQr(token);
    }
  }

  static async downloadQr(token: string) {
    return FileSystem.downloadAsync(
      DownloadQrService.baseRoute,
      DownloadQrService.qrCodeURI,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
