import { Alert, AlertButton } from "react-native";
import { useContextState } from "../ContexState";
import { LoanService } from "../services/LoanManagementService";

const useManageLoans = () => {
  const { contextState } = useContextState();

  const markBookAsReturned = async (
    inventoryNumber: number,
    alertButtons: AlertButton[],
  ) => {
    const result = await LoanService.setLoanStatusReturned(
      inventoryNumber,
      contextState.accessToken as string,
    );

    if (result.detail) {
      Alert.alert("Error devolviendo este libro", result.detail, alertButtons);
      return false;
    } else {
      Alert.alert("Libro devuelto.", "", alertButtons);
      return true;
    }
  };

  return {
    markBookAsReturned,
  };
};

export default useManageLoans;
