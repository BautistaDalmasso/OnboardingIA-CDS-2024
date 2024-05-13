import * as FileSystem from "expo-file-system";

import { ServerAddress } from "../common/consts/serverAddress";
import { IUser } from "../common/interfaces/User";

export class DownloadQrService {
  private static baseRoute: string = `${ServerAddress}qr`;

  static async getQr(
    isConnected: boolean,
    token?: string,
    user?: IUser,
  ): Promise<string> {
    return "";
  }

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
