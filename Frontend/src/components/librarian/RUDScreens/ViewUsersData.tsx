import React from "react";
import { IUserDTO } from "../../../common/interfaces/User";
import TableDataUser from "./TableDataUser";
import {
  LicenceLevel,
  licenceLevelToStr,
} from "../../../common/enums/licenceLevels";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import LinkButton from "../../common/LinkButton";

interface ViewUsersDataProps {
  user: IUserDTO | null;
  onPressUpdateData: () => void;
  onPressUpdateLicence: () => void;
  onPressSearchAnotherUser: () => void;
}

const ViewUsersData = ({
  user,
  onPressUpdateData,
  onPressUpdateLicence,
  onPressSearchAnotherUser,
}: ViewUsersDataProps) => {
  if (user === null) {
    return <></>;
  }

  return (
    <>
      <TableDataUser
        name={user.firstName}
        lastName={user.lastName}
        email={user.email}
        dni={user.dni ? user.dni : "NO Registrado"}
        licence={licenceLevelToStr(user.licenceLevel as LicenceLevel)}
      />

      <TouchableOpacity style={styles.button} onPress={onPressUpdateData}>
        <Text style={styles.buttonText}>Modificar datos</Text>
      </TouchableOpacity>

      {user.dni && (
        <TouchableOpacity style={styles.button} onPress={onPressUpdateLicence}>
          <Text style={styles.buttonText}>Mejorar nivel de carnet</Text>
        </TouchableOpacity>
      )}

      <LinkButton
        text="Buscar otro usuario"
        onPress={onPressSearchAnotherUser}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ViewUsersData;
