import AsyncStorage from "@react-native-async-storage/async-storage";
import { offlineInformation } from "../common/enums/offlineInformation";
import { IUser } from "../common/interfaces/User";

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
}
