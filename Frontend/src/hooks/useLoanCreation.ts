import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import {
  isEmptyNumberInput,
  isEmptyTextInput,
  isValidInventoryNumber,
} from "../common/utils/inputCheck";

import { LoanService } from "../services/LoanManagementService";
import useRUDUsers from "./useRUDUsers";
import { IUser, IUserDTO } from "../common/interfaces/User";
import { ILoanValid, IReservationRequest } from "../common/interfaces/Book";

const useLoanCreation = () => {
  const { contextState, setContextState } = useContextState();
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

      const loanValid = await LoanService.check_loan_valid(
        inventoryNumber,
        userEmail,
      );

      if (loanValid?.inventory_number == null) {
        Alert.alert("Error", "Numero de Inventario innexistente.");
        return;
      } else {
        const loanRequest = createLoanData(loanValid);
        await LoanService.assignLoan(
          loanRequest,
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

  const assignLoanBook = async (email: string, isbn: string) => {
    try {
      //TO DO
      Alert.alert(
        "¡Creación de prestamo exitosa!",
        "La realización del prestamo del libro solicitado por el usuario fue registrado exitosamente.",
      );
    } catch (error) {
      console.error("Error en creación de prestamo:", error);
    }
  };

  const createLoanData = (book: ILoanValid) => {
    const futureDate: Date = new Date(new Date());
    futureDate.setDate(futureDate.getDate() + 7);

    const loanRequest: ILoanValid = {
      isbn: book.isbn,
      expiration_date: futureDate,
      user_email: book.user_email,
      inventory_number: book.inventory_number,
      licence_level: 0,
    };
    return loanRequest;
  };

  const createReservationData = (isbn: string) => {
    const futureDate: Date = new Date(new Date());
    futureDate.setDate(futureDate.getDate() + 7);

    const reservationRequest: IReservationRequest = {
      isbn: isbn,
      expiration_date: futureDate,
      user_email: (contextState.user as IUser).email,
    };

    return reservationRequest;
  };

  return {
    assignLoan,
    checkUser,
    assignLoanBook,
  };
};
export default useLoanCreation;
