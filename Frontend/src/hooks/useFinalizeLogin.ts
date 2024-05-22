import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { ILoginResponse, IUser } from "../common/interfaces/User";
import { ConnectionType } from "../common/enums/connectionType";
import useOfflineStorage from "./useOfflineStorage";
import useQr from "./useQr";

const useFinalizeLogin = () => {
  const { setContextState } = useContextState();
  const { storeLastUser, saveUserLoans } = useOfflineStorage();
  const { updateQrCode } = useQr();

  const finalizeLogin = async (loginResponse: ILoginResponse) => {
    if (loginResponse.access_token) {
      setContextState((state) => ({
        ...state,
        user: loginResponse.user,
        connectionType: ConnectionType.ONLINE,
        accessToken: loginResponse.access_token,
        messages: [],
        loans: loginResponse.loans,
      }));

      await saveUserLoans(loginResponse.loans);
      await storeLastUser(loginResponse.user);
    }

    if (loginResponse.detail) {
      Alert.alert("Error", loginResponse.detail);

      return false;
    }

    await fetchDataForOfflineUse(
      loginResponse.access_token,
      loginResponse.user,
    );
    return true;
  };

  const fetchDataForOfflineUse = async (access_token: string, user: IUser) => {
    // TODO: also fetch user loans information.
    await fetchQrCode(access_token, user);
  };

  const fetchQrCode = async (access_token: string, user: IUser) => {
    await updateQrCode(access_token, user);
  };

  return {
    finalizeLogin,
  };
};

export default useFinalizeLogin;
