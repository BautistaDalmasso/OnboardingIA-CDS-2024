import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import {
  isEmptyNumberInput,
  isEmptyTextInput,
  isValidInventoryNumber,
} from "../common/utils/inputCheck";

import { LoanService } from "../services/LoanManagementService";
import useRUDUsers from "./useRUDUsers";
import { IUserDTO } from "../common/interfaces/User";
import { ILoanValid } from "../common/interfaces/Book";

const useLoanCreation = () => {
  const { contextState } = useContextState();
  const { consultUser } = useRUDUsers();

  const assignLoan = async (inventoryNumber: number, userEmail: string) => {
    try {
      if (isEmptyNumberInput(inventoryNumber) || isEmptyTextInput(userEmail)) {
        Alert.alert("Por favor", "Complete todos los datos antes de enviar.");
        return false;
      }
      if (!isValidInventoryNumber(inventoryNumber)) {
        Alert.alert(
          "Por favor",
          "Ingrese el número de inventario sin espacios, puntos, guiones o comas.",
        );
        return false;
      }

      const loanValid = await LoanService.checkLoanValid(
        inventoryNumber,
        userEmail,
      );

      if (loanValid.detail) {
        Alert.alert("Error", loanValid.detail);
        return false;
      }

      if (loanValid?.inventory_number == null) {
        Alert.alert("Error", "Numero de Inventario innexistente.");
        return false;
      }

      if (loanValid.type === "new") {
        return await assignNewLoan(loanValid);
      } else {
        return await markReservationCheckout(loanValid);
      }


    } catch (error) {
      console.error("Error en creación de prestamo:", error);
      return false;
    }
  };

  const assignNewLoan = async (loanData: ILoanValid) => {
    const loanRequest = createLoanData(loanData);
    await LoanService.assignLoan(
      loanRequest,
      contextState.accessToken as string,
    );

    Alert.alert(
      "¡Creación de prestamo exitosa!",
      "La realización del prestamo del libro solicitado por el usuario fue registrado exitosamente.",
    );
    return true;
  }

  const markReservationCheckout = async (loanData: ILoanValid) => {
    await LoanService.setLoanStatusLoaned(
        loanData.inventory_number,
        contextState.accessToken as string,
    );

    Alert.alert(
        "¡Retiro de Reserva Exitoso!",
        "El retiro del libro reservado fue realizado exitosamente.",
    );

    return true;
  }

  const checkUser = async (userEmail: string): Promise<IUserDTO | null> => {
    try {
      const user = await consultUser(userEmail);
      if (user?.email == null) {
        Alert.alert("Error", "Usuario NO registrado.");
        return null;
      }
      if (user?.licenceLevel === 0) {
        Alert.alert(
          "Atención",
          "Usuario sin Carnet, por lo tanto, No se le puede asignar un prestamo.",
        );
        return null;
      } else {
        return user;
      }
    } catch (error) {
      console.error("Error en creación de prestamo:", error);
      return null;
    }
  };

  const createLoanData = (book: ILoanValid) => {
    const futureDate: Date = new Date(new Date());
    futureDate.setDate(futureDate.getDate() + 7);

    book.expiration_date = futureDate;

    return book;
  };

  return {
    assignLoan,
    checkUser,
  };
};
export default useLoanCreation;
