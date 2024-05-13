import AsyncStorage from "@react-native-async-storage/async-storage";
import { offlineInformation } from "../common/enums/offlineInformation";
import { IUser } from "../common/interfaces/User";
import { IQrCodeInfo } from "../common/interfaces/QrCodeInfo";

export class OfflineStorageService {
  static async storeLastUser(user: IUser) {
    await AsyncStorage.setItem(
      offlineInformation.LAST_USER,
      JSON.stringify(user),
    );
  }

  static async getLastUser(): Promise<IUser | null> {
    const user = await AsyncStorage.getItem(offlineInformation.LAST_USER);

    if (user !== null) {
      return JSON.parse(user);
    }

    return null;
  }

  static async saveLastQrCodeInfo(user: IUser) {
    const qrCodeInfo: IQrCodeInfo = {
      lastUpdate: user.lastPermissionUpdate,
      userEmail: user.email,
    };

    await AsyncStorage.setItem(
      offlineInformation.QR_CODE_INFO,
      JSON.stringify(qrCodeInfo),
    );
  }

  static async getLastQrCodeInfo(): Promise<IQrCodeInfo | null> {
    const qrCodeInfo = await AsyncStorage.getItem(
      offlineInformation.QR_CODE_INFO,
    );

    if (qrCodeInfo !== null) {
      return JSON.parse(qrCodeInfo);
    }

    return null;
  }
}
