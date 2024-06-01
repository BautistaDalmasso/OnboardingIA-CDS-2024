import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import LinkButton from "../../common/LinkButton";
import { IUserDTO } from "../../../common/interfaces/User";
import { LicenceLevel } from "../../../common/enums/licenceLevels";
import useRUDUsers from "../../../hooks/useRUDUsers";

interface UpgradeUsersLicenceProps {
  user: IUserDTO | null;
  disabled: boolean;
  onUpgradeFinished: () => void;
  onPressReturnToUsersData: () => void;
}

const UpgradeUsersLicence = ({
  user,
  disabled,
  onUpgradeFinished,
  onPressReturnToUsersData,
}: UpgradeUsersLicenceProps) => {
  const { updateUsersLicence } = useRUDUsers();

  const handleLevel = async (level: LicenceLevel) => {
    if (!user) {
      throw Error("No user selected.");
    }

    updateUsersLicence(user.email, level);

    Alert.alert("", "¡Actualizacion de nivel de carnet exitosa!");

    onUpgradeFinished();
  };

  return (
    <>
      <Text style={styles.instruction}>
        Cambiar nivel de carnet del usuario a{" "}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLevel(LicenceLevel.TRUSTED)}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>Confiado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLevel(LicenceLevel.RESEARCHER)}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>Investigador</Text>
        </TouchableOpacity>
      </View>

      <LinkButton
        text="Volver a datos del usuario >>"
        onPress={onPressReturnToUsersData}
      />
    </>
  );
};
const styles = StyleSheet.create({
  instruction: {
    bottom: 15,
    marginBottom: 5,
    marginTop: 20,
  },
  buttonsContainer: {
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "85%",
  },
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

export default UpgradeUsersLicence;
