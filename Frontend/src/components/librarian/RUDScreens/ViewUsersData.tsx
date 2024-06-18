import React from "react";
import { IUserDTO } from "../../../common/interfaces/User";
import TableDataUser from "./TableDataUser";
import {
  LicenceLevel,
  licenceLevelToStr,
} from "../../../common/enums/licenceLevels";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import LinkButton from "../../common/LinkButton";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

interface ViewUsersDataProps {
  user: IUserDTO | null;
  onPressUpdateData: () => void;
  onPressUpdateLicence: () => void;
  onPressSearchAnotherUser: () => void;
  onPressDeleteUser:() => void;
}

const ViewUsersData = ({
  user,
  onPressUpdateData,
  onPressUpdateLicence,
  onPressSearchAnotherUser,
  onPressDeleteUser,
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

        <TouchableOpacity style={styles.button} onPress={onPressDeleteUser}>
          <Text style={styles.buttonText}>Dar de baja al usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBack} onPress={onPressSearchAnotherUser}>
          <Ionicons name="arrow-back-sharp" size={wp('6.5%')} color="#056D8D"/>
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
    </>

  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection:"row",
    width:wp('60%'),
    marginTop: wp('3%'),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#056D8D",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 10,
  },
  buttonBack: {
    flexDirection:"row",
    width: wp('25%'),
    color: "#666",
    marginTop: wp('3%'),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#51D7FF",
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
  buttonText: {
    fontSize: wp('4%'),
    fontWeight: "bold",
    color: "white",
  },
});

export default ViewUsersData;
