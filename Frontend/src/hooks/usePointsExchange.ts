import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { PointsExchangeService } from "../services/pointsExchangeService";
import useFinalizeLogin from "./useFinalizeLogin";
import { IUser } from "../common/interfaces/User";

const usePointsExchange = () => {
  const { contextState, setContextState } = useContextState();
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

  const substractPoints = async (points: number) => {
    setContextState((state) => ({
        ...state,
        user: {
            ...(state.user as IUser),
            points: (state.user as IUser).points - points,
        },
    }))
  }

  const exchangeForIncreaseLimit= async () => {
    await PointsExchangeService.updateToIncreaseLimit(
      contextState.accessToken as string,
    )
    Alert.alert("¡¡Felicitaciones!!","Ve a Solicitar préstamos. Ya puedes solicitar más libros.")
  }

  return {
    hasEnoughPoints,
    exchangeForTrustedLicence,
    exchangeForIncreaseLimit,
    substractPoints,
  };


};

export default usePointsExchange;
