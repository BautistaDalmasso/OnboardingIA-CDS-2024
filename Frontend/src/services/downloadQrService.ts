import * as FileSystem from "expo-file-system";

import { ServerAddress } from "../common/consts/serverAddress";

export class DownloadQrService {
  private static baseRoute: string = `${ServerAddress}qr`;

  static async downloadQr(token: string) {
    return FileSystem.downloadAsync(
      this.baseRoute,
      FileSystem.documentDirectory + "qr.png",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
