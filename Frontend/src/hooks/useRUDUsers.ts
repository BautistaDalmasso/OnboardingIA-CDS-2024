import { Alert } from "react-native";
import { LibrarianService } from "../services/librarianService";
import { useContextState } from "../ContexState";
import { IUser, IUserDTO, IDowngradeUserRole } from "../common/interfaces/User";
import { LicenceLevel } from "../common/enums/licenceLevels";
import { isValidDni, isValidEmail } from "../common/utils/inputCheck";

const useRUDUsers = () => {
  const { contextState, setContextState } = useContextState();

  const consultUser = async (userEmail: string): Promise<IUserDTO | null> => {
    if (!isValidEmail(userEmail)) {
      Alert.alert("Por favor", "Ingrese un correo valido.");
      return null;
    }

    try {
      const response = await LibrarianService.consultUser(
        userEmail,
        contextState.accessToken as string,
      );

      if (response.detail) {
        return null;
      }

      return response;
    } catch (error) {
      console.error(error);

      return null;
    }
  };

  const updateUsersName = async (userEmail: string, newName: string) => {
    await LibrarianService.updateName(
      userEmail,
      newName,
      contextState.accessToken as string,
    );

    return true;
  };

  const updateUsersLastName = async (
    userEmail: string,
    newLastName: string,
  ) => {
    await LibrarianService.updateLastName(
      userEmail,
      newLastName,
      contextState.accessToken as string,
    );

    return true;
  };

  const updateUsersDni = async (
    userEmail: string,
    newDni: string,
    existingDni?: string,
  ) => {
    if (!existingDni) {
      Alert.alert(
        "Error",
        "El usuario no registro su DNI, ni solicito su carnet.",
      );
      return false;
    }
    if (!isValidDni(newDni)) {
      Alert.alert("Error", "Por favor ingrese un dni valido");
      return false;
    }

    await LibrarianService.updateDNI(
      userEmail,
      newDni,
      contextState.accessToken as string,
    );

    return true;
  };

  const updateUsersLicence = async (
    userEmail: string,
    newLicenceLevel: LicenceLevel,
  ) => {
    const result = await LibrarianService.updateLicence(
      userEmail,
      newLicenceLevel,
      contextState.accessToken as string,
    );

    setContextState((state) => ({
      ...state,
      user: {
        ...state.user,
        licenceLevel: result.licenceLevel,
      } as IUser,
    }));
  };

  const deleteUser = async   (userEmail: string) => {
    const isValidRequestDeletion= await LibrarianService.checkUnsubscribeRequest(userEmail,  contextState.accessToken as string,)
    if(isValidRequestDeletion==false){
      Alert.alert("ERROR","Autoeliminación denegada.");
      return;
    }
    const response = await LibrarianService.deleteUser(userEmail,  contextState.accessToken as string,);

    if (!response) {
      Alert.alert("", "¡Usuario dado de baja exitosamente!");
    }
  }


  return {
    consultUser,
    updateUsersName,
    updateUsersLastName,
    updateUsersDni,
    updateUsersLicence,
    deleteUser,
  };
};

export default useRUDUsers;
