import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import CustomTextInput from "../../common/CustomTextInput";
import LinkButton from "../../common/LinkButton";
import { IUserDTO } from "../../../common/interfaces/User";
import useRUDUsers from "../../../hooks/useRUDUsers";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

enum fieldOptions {
  FIRST_NAME = "Nombre",
  LAST_NAME = "Apellido",
  DNI = "DNI",
}

interface UsersDataProps {
  startingInputValue: string;
  user: IUserDTO | null;
  onFinishUpdate: () => void;
  onPressReturn: () => void;
}

const UpdateUser = ({
  user,
  startingInputValue,
  onFinishUpdate,
  onPressReturn,
}: UsersDataProps) => {
  const { updateUsersName, updateUsersLastName, updateUsersDni } =
    useRUDUsers();
  const [fieldToUpdate, setFieldToUpdate] = useState(
    fieldOptions.FIRST_NAME as string,
  );
  const [newFieldValue, setNewFieldValue] = useState(startingInputValue);

  const updateUsersData = async () => {
    setNewFieldValue(newFieldValue.trim());
    if (newFieldValue === "") {
      Alert.alert(
        "Error",
        "Por favor ingrese un " + fieldToUpdate + " valido.",
      );

      return;
    }

    if (!user) {
      throw Error("User wasn't selected.");
    }

    switch (fieldToUpdate) {
      case fieldOptions.FIRST_NAME:
        await updateUsersName(user.email, newFieldValue);
        break;

      case fieldOptions.LAST_NAME:
        await updateUsersLastName(user.email, newFieldValue);
        break;

      case fieldOptions.DNI:
        const wasUpdated = await updateUsersDni(
          user.email,
          newFieldValue,
          user.dni,
        );

        if (!wasUpdated) {
          setNewFieldValue("");
          return;
        }
      default:
        break;
    }

    Alert.alert("Se cambio el " + fieldToUpdate + " del usuario exitosamente.");

    setNewFieldValue("");
    onFinishUpdate();
  };

  if (user === null) {
    return <></>;
  }

  return (
    <>
      <Picker
        selectedValue={fieldToUpdate}
        style={styles.picker}
        onValueChange={(itemValue: string) => setFieldToUpdate(itemValue)}
      >
        <Picker.Item
          label="Actualizar Nombre"
          value={fieldOptions.FIRST_NAME}
        />
        <Picker.Item
          label="Actualizar Apellido"
          value={fieldOptions.LAST_NAME}
        />
        {user.dni && (
          <Picker.Item label="Actualizar DNI" value={fieldOptions.DNI} />
        )}
      </Picker>

      <View style={styles.inputContainer}>
        <CustomTextInput
          placeholder={`Ingrese nuevo ${fieldToUpdate}`}
          value={newFieldValue}
          onChangeText={(text) => setNewFieldValue(text)}
        />

        <TouchableOpacity
          style={styles.buttonUpdateData}
          onPress={updateUsersData}
        >
          <Text style={styles.textButtonUpdateData}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonBack} onPress={onPressReturn}>
          <Ionicons name="arrow-back-sharp" size={wp('6.5%')} color="white"/>
          <Text style={styles.buttonText}>Volver a datos del usuario </Text>
        </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#E6E6E6",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    height: "10%",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 35,
    paddingLeft: 5,
    borderColor: "#E6E6E6",
    borderWidth: 1,
  },
  buttonUpdateData: {
    backgroundColor: "#056D8D",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    maxWidth: 300,
    marginHorizontal: 5,
  },
  textButtonUpdateData: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontSize: wp('3.5%'),
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

export default UpdateUser;
