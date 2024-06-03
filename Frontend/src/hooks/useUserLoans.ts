import { Alert} from "react-native";
import { useContextState } from "../ContexState";
import { IReservationRequest } from "../common/interfaces/Book";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";
import { IUser } from "../common/interfaces/User";
import { LoanService } from "../services/LoanManagementService";
import useOfflineStorage from "./useOfflineStorage";

const useUserLoans = () => {
  const { contextState, setContextState } = useContextState();
  const { saveUserLoans } = useOfflineStorage();


  const reserveBook = async (isbn: string) => {
    const checkLimite= await LoanService.checkLoanLimitation(contextState.accessToken as string,);
    if(!checkLimite){
      Alert.alert("¡Atención, ha solicitado demasiados libros!" , "Para poder solicitar otro libro debera acercarse a la Biblioteca.");
      return;
    }else{

    const reservationRequest = createReservationData(isbn);

    const reservedBookData = await LoanService.requestBookReservation(
      reservationRequest,
      contextState.accessToken as string,
    );

    if (reservedBookData.detail) {
      Alert.alert("Error solicitando libro.", reservedBookData.detail);
      return;
    }
    extendLoanData(reservedBookData);
    }
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

  const extendLoanData = async (loanInformation: ILoanInformation) => {
    setContextState((state) => ({
      ...state,
      loans: [...state.loans, loanInformation],
    }));

    saveUserLoans(contextState.loans);
  };

  return {
    reserveBook,
  };
};

export default useUserLoans;
