import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import LinkButton from "../../common/LinkButton";
import { IUserDTO } from "../../../common/interfaces/User";
import { LicenceLevel } from "../../../common/enums/licenceLevels";
import useRUDUsers from "../../../hooks/useRUDUsers";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

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
      <TouchableOpacity style={styles.buttonBack} onPress={onPressReturnToUsersData}>
          <Ionicons name="arrow-back-sharp" size={wp('6.5%')} color="white"/>
          <Text style={styles.buttonTextBack}>Volver a datos del usuario </Text>
        </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  instruction: {
    fontSize: wp('4.5%'),
    bottom: 15,
    marginBottom: 5,
    marginTop: hp('0.5%'),
  },
  buttonsContainer: {
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: wp('90%'),
  },
  button: {
    backgroundColor: "#51D7FF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonText: {
    color: "#056D8D",
    fontSize: wp('4.5%'),
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextBack: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonBack: {
      flexDirection:"row",
      width: wp('68%'),
      marginTop: wp('3%'),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#056D8D",
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 10,
      padding: 10,
    },
});

export default UpgradeUsersLicence;
