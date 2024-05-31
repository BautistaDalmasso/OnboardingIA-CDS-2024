import React, { useState, useRef } from "react";
import {
  Alert,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CustomTextInput from "../common/CustomTextInput";
import TableDataUser from "./TableDataUser";
import useRUDUsers from "../../hooks/useRUDUsers";
import { IUserDTO } from "../../common/interfaces/User";
import {
  LicenceLevel,
  licenceLevelToStr,
} from "../../common/enums/licenceLevels";
import { Picker } from "@react-native-picker/picker";
import LinkButton from "../common/LinkButton";

enum fieldOptions {
  FIRST_NAME = "Nombre",
  LAST_NAME = "Apellido",
  DNI = "DNI",
}

enum pages {
  USER_SELECT = 0,
  USER_DATA = 1,
  UPDATE_DATA = 2,
  UPGRADE_LICENCE = 3,
}

const RUDUser = () => {
  const {
    consultUser,
    updateUsersName,
    updateUsersLastName,
    updateUsersDni,
    updateUsersLicence,
  } = useRUDUsers();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [fieldToUpdate, setFieldToUpdate] = useState(
    fieldOptions.FIRST_NAME as string,
  );
  const [user, setUser] = useState<IUserDTO | null>(null);
  const options = [
    { label: fieldOptions.FIRST_NAME, value: fieldOptions.FIRST_NAME },
    { label: fieldOptions.LAST_NAME, value: fieldOptions.LAST_NAME },
    { label: fieldOptions.DNI, value: fieldOptions.DNI },
  ];

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        handleChangePage(pages.USER_SELECT);
      };
    }, []),
  );

  const handleChangePage = (pageIndex: number) => {
    setInputValue("");

    scrollViewRef.current?.scrollTo({
      y: pageIndex * Dimensions.get("window").height,
      animated: true,
    });
  };

  const gotoUpgradeLicenceLevel = async () => {
    if (!user?.dni) {
      Alert.alert(
        "Error",
        "El usuario NO tiene carnet regular ni dni registrados.",
      );
      return;
    }
    handleChangePage(pages.UPGRADE_LICENCE);
  };

  const handleLevel = async (level: LicenceLevel) => {
    if (!user) {
      throw Error("No user selected.");
    }

    updateUsersLicence(user.email, level);

    Alert.alert("", "¡Actualizacion de nivel de carnet exitosa!");

    handleChangePage(pages.USER_DATA);
    handleLoadingData(user.email);
  };

  const updateUsersData = async () => {
    setInputValue(inputValue.trim());
    if (inputValue === "") {
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
        await updateUsersName(user.email, inputValue);
        break;
      case fieldOptions.LAST_NAME:
        await updateUsersLastName(user.email, inputValue);
        break;
      case fieldOptions.DNI:
        const wasUpdated = await updateUsersDni(
          user.email,
          inputValue,
          user.dni,
        );

        if (!wasUpdated) {
          setInputValue("");
          return;
        }
      default:
        break;
    }

    Alert.alert("Se cambio el " + fieldToUpdate + " del usuario exitosamente.");
    handleChangePage(pages.USER_DATA);
    handleLoadingData(user.email);
  };

  const handleLoadingData = async (userEmail: string) => {
    try {
      setLoading(true);

      const user = await consultUser(userEmail);

      if (user == null) {
        Alert.alert("Error", "Usuario NO registrado");
        return;
      }

      handleChangePage(pages.USER_DATA);

      setUser(user);
    } catch (error) {
      console.error("Error in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualización de usuario</Text>

      <ScrollView
        ref={scrollViewRef}
        pagingEnabled={false}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Select user page. */}
        <View key={pages.USER_SELECT} style={styles.page}>
          <Text style={styles.instruction}>
            Ingrese el email del usuario registrado o ingrese el QR.
          </Text>
          <CustomTextInput
            placeholder={"email"}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLoadingData(inputValue)}
          >
            <Text style={styles.buttonText}>Buscar Usuario</Text>
          </TouchableOpacity>

          {/* TODO */}
          <TouchableOpacity
            style={styles.buttonQR}
            onPress={() => console.log("TODO")}
          >
            <Text style={styles.buttonText}>Escanear QR</Text>
          </TouchableOpacity>
        </View>

        {/* View user's data page. */}
        <View key={pages.USER_DATA} style={styles.page}>
          {user && (
            <TableDataUser
              name={user.firstName}
              lastName={user.lastName}
              email={user.email}
              dni={user.dni ? user.dni : "NO Registrado"}
              licence={licenceLevelToStr(user.licenceLevel as LicenceLevel)}
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChangePage(pages.UPDATE_DATA)}
          >
            <Text style={styles.buttonText}>Modificar datos</Text>
          </TouchableOpacity>
          {user && user.dni && (
            <TouchableOpacity
              style={styles.button}
              onPress={gotoUpgradeLicenceLevel}
            >
              <Text style={styles.buttonText}>Mejorar nivel de carnet</Text>
            </TouchableOpacity>
          )}
          <LinkButton
            text="Buscar otro usuario"
            onPress={() => (
              handleChangePage(pages.USER_SELECT), setInputValue("")
            )}
          />
        </View>

        {/* Update user's data page. */}
        <View key={pages.UPDATE_DATA} style={styles.page}>
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
            {user && user.dni && (
              <Picker.Item label="Actualizar DNI" value={fieldOptions.DNI} />
            )}
          </Picker>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder={`Ingrese nuevo ${fieldToUpdate}`}
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />

            <TouchableOpacity
              style={styles.buttonUpdateData}
              onPress={updateUsersData}
            >
              <Text style={styles.textButtonUpdateData}>Actualizar</Text>
            </TouchableOpacity>
          </View>

          <LinkButton
            text="Volver a datos del usuario >>"
            onPress={() => handleChangePage(pages.USER_DATA)}
          />
        </View>

        {/* Upgrade user's licence page */}
        <View key={pages.UPGRADE_LICENCE} style={styles.page}>
          <Text style={styles.instruction}>
            Cambiar nivel de carnet del usuario a{" "}
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLevel(LicenceLevel.TRUSTED)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Confiado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLevel(LicenceLevel.RESEARCHER)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Investigador</Text>
            </TouchableOpacity>
          </View>

          <LinkButton
            text="Volver a datos del usuario >>"
            onPress={() => handleChangePage(pages.USER_DATA)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 5,
    alignContent: "center",
  },
  title: {
    marginTop: 100,
    fontSize: 22,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    marginBottom: 20,
  },
  instruction: {
    bottom: 15,
    marginBottom: 5,
    marginTop: 20,
  },

  input: {
    flex: 1,
    padding: 5,
    borderWidth: 0,
    width: 100,
  },
  button: {
    backgroundColor: "#3369FF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100,
    maxWidth: 300,
    margin: 10,
  },
  buttonQR: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
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
  buttonsContainer: {
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "85%",
  },
  page: {
    width: Dimensions.get("window").width - 60,
    height: Dimensions.get("window").height,
    alignItems: "center",
    margin: 10,
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
    backgroundColor: "#3369FF",
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
  picker: {
    height: 50,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#E6E6E6",
    marginBottom: 10,
  },
});

export default RUDUser;
