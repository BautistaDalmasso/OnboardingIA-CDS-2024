import { useContextState } from "../ContexState";

const usePointsExchange = () => {
  const { contextState } = useContextState();

  const hasEnoughPoints = (requiredPoints: number) => {
    if (contextState.user === null) {
      throw new Error("User not properly logged in.");
    }
    console.log(requiredPoints <= contextState.user.points);
    return requiredPoints <= contextState.user.points;
  };

  const exchangeForTrustedLicence = async () => {
    console.log("exchanged");
  };

  return {
    hasEnoughPoints,
    exchangeForTrustedLicence,
  };
};

export default usePointsExchange;
