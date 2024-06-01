import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import {
  isEmptyNumberInput,
  isEmptyTextInput,
  isValidInventoryNumber,
} from "../common/utils/inputCheck";
import useRUDUsers from "./useRUDUsers";
import { LoanService } from "../services/LoanManagementService";

const useLoanCreation = () => {
  const { contextState } = useContextState();
  const { consultUser } = useRUDUsers();

  const assignLoan = async (inventoryNumber: number, userEmail: string) => {
    try {
      if (isEmptyNumberInput(inventoryNumber) || isEmptyTextInput(userEmail)) {
        Alert.alert("Por favor", "Complete todos los datos antes de enviar.");
        return;
      }
      if (!isValidInventoryNumber(inventoryNumber)) {
        Alert.alert(
          "Por favor",
          "Ingrese el número de inventario sin espacios, puntos, guiones o comas.",
        );
        return;
      }
      const user = await consultUser(userEmail);
      if (user?.email == null) {
        Alert.alert("Error", "Usuario NO registrado.");
        return;
      }
      const loanValid = await LoanService.check_loan_valid(
        inventoryNumber,
        userEmail,
      );
      if (loanValid?.inventory_number == null) {
        Alert.alert("Error", "Numero de Inventario innexistente.");
        return;
      } else {
        await LoanService.assignLoan(
          inventoryNumber,
          userEmail,
          contextState.accessToken as string,
        );
        Alert.alert(
          "¡Creación de prestamo exitosa!",
          "La realización del prestamo del libro solicitado por el usuario fue registrado exitosamente.",
        );
      }
    } catch (error) {
      console.error("Error en creación de prestamo:", error);
    }
  };
  return {
    assignLoan,
  };
};
export default useLoanCreation;
