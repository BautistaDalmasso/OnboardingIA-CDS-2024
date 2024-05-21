import AsyncStorage from "@react-native-async-storage/async-storage";
import { offlineInformation } from "../common/enums/offlineInformation";
import { IUser } from "../common/interfaces/User";
import { IQrCodeInfo, QrToggle } from "../common/interfaces/QrCodeInfo";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";

const useOfflineStorage = () => {
  const storeLastUser = async (user: IUser) => {
    await AsyncStorage.setItem(
      offlineInformation.LAST_USER,
      JSON.stringify(user),
    );
  };

  const getLastUser = async (): Promise<IUser | null> => {
    const user = await AsyncStorage.getItem(offlineInformation.LAST_USER);

    if (user !== null) {
      return JSON.parse(user);
    }

    return null;
  };

  const saveLastQrCodeInfo = async (user: IUser, toggle: QrToggle) => {
    const qrCodeInfo: IQrCodeInfo = {
      lastUpdate: user.lastPermissionUpdate,
      userEmail: user.email,
      toggle: toggle,
    };

    await AsyncStorage.setItem(
      offlineInformation.QR_CODE_INFO,
      JSON.stringify(qrCodeInfo),
    );
  };

  const getLastQrCodeInfo = async (): Promise<IQrCodeInfo | null> => {
    const qrCodeInfo = await AsyncStorage.getItem(
      offlineInformation.QR_CODE_INFO,
    );

    if (qrCodeInfo !== null) {
      return JSON.parse(qrCodeInfo);
    }

    return null;
  };

  const saveUserLoans = async (loans: ILoanInformation[]) => {
    await AsyncStorage.setItem(
      offlineInformation.LAST_USER_LOANS,
      JSON.stringify(loans),
    );
  };

  return {
    storeLastUser,
    getLastUser,
    saveLastQrCodeInfo,
    getLastQrCodeInfo,
    saveUserLoans,
  };
};

export default useOfflineStorage;
