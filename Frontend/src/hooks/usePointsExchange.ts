import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { PointsExchangeService } from "../services/pointsExchangeService";
import useFinalizeLogin from "./useFinalizeLogin";

const usePointsExchange = () => {
  const { contextState } = useContextState();
  const { finalizeLogin } = useFinalizeLogin();

  const hasEnoughPoints = (requiredPoints: number) => {
    if (contextState.user === null) {
      throw new Error("User not properly logged in.");
    }

    return requiredPoints <= contextState.user.points;
  };

  const exchangeForTrustedLicence = async () => {
    const response = await PointsExchangeService.updateToTrustedLicence(
      contextState.accessToken as string,
    );

    if (response.detail) {
      Alert.alert(response.detail);
      return;
    }

    return await finalizeLogin(response);
  };

  return {
    hasEnoughPoints,
    exchangeForTrustedLicence,
  };
};

export default usePointsExchange;
