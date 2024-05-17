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
import { LibrarianService } from "../services/librarianService";
import CustomTextInput from "./CustomTextInput";
import TableDataUser from "./TableDataUser";
import Dropdown from "./Dropdown";

const CRUDuser = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dniRegex = /^\d{11}$/;
  const [selectedValue, setSelectedValue] = useState(
    "Seleccione dato a actualizar >>"
  );
  const [name, setname] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [licence, setLicence] = useState("");
  const options = [
    { label: "Nombre", value: "Nombre" },
    { label: "Apellido", value: "Apellido" },
    { label: "DNI", value: "DNI" },
    { label: "email", value: "email" },
  ];

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setInputValue("");
        handleNextPage(0);
      };
    }, [])
  );

  const handleNextPage = (pageIndex: number) => {
    scrollViewRef.current?.scrollTo({
      y: pageIndex * Dimensions.get("window").height,
      animated: true,
    });
  };

  const upgradeLicenseLevel = async () => {
    if (dni == "NO registra") {
      Alert.alert(
        "Error",
        "El usuario NO tiene carnet regular ni dni registrados."
      );
      return;
    }
    handleNextPage(3);
  };

  const gotoUpdatingUserData = async () => {
    setInputValue("");
    handleNextPage(2);
  };

  const handleLevel = async (level: number) => {
    await LibrarianService.updateLicense(email, level);

    Alert.alert("", "¡Actualizacion de nivel de canet exitosa!");

    handleNextPage(1);
    handleLoadingData();
  };

  const unsubscribeUser = async () => {
    try {
      setLoading(true);
      const response = await LibrarianService.deleteUser(inputValue);

      if (!response) {
        Alert.alert("", "¡Usuario dado de baja exitosamente!");
        setInputValue("");
        handleNextPage(0);
      }
    } catch (error) {
      console.error("Error in:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const upgradeData = async () => {
    setInputValue(inputValue.trim());
    if (!inputValue) {
      Alert.alert(
        "Error",
        "Por favor ingrese un " + selectedValue + " valido."
      );
      setInputValue("");
      return;
    }

    if (selectedValue === options[0].label) {
      await LibrarianService.updateName(email, inputValue);
    }
    if (selectedValue === options[1].label) {
      await LibrarianService.updateLastName(email, inputValue);
    }
    if (selectedValue === options[2].label) {
      if (dni === "NO registra") {
        Alert.alert(
          "Error",
          "El usuario no registro su DNI, ni solicito su carnet."
        );
        setInputValue("");
        return;
      }
      if (!dniRegex.test(inputValue)) {
        Alert.alert("Error", "Por favor ingrese un dni valido");
        setInputValue("");
        return;
      }
      await LibrarianService.updateDNI(email, inputValue);
    }
    if (selectedValue === options[3].label) {
      if (!emailRegex.test(inputValue)) {
        Alert.alert("Error", "Por favor ingrese un correo valido.");
        setInputValue("");
        return;
      }
      await LibrarianService.updateEmail(email, inputValue);
    }
    Alert.alert(
      "",
      "Se cambio el " + selectedValue + " del usuario exitosamente."
    );
    setInputValue("");
    handleNextPage(0);
  };

  const handleLoadingData = async () => {
    try {
      setLoading(true);
      if (!emailRegex.test(inputValue)) {
        Alert.alert(
          "Por favor",
          "Ingrese un correo valido y una contraseña de más de 6 caracteres."
        );
        setLoading(false);
        setInputValue("");
        return;
      }
      const response = await LibrarianService.consultUser(inputValue);
      if (!response.email) {
        Alert.alert("Error", "Usuario NO registrado");
        setLoading(false);
        setInputValue("");
        return;
      }

      handleNextPage(1);
      console.log(response);
      const userData = [
        response.email || "NO registra",
        response.dni || "NO registra",
        response.firstName || "NO registra",
        response.lastName || "NO registra",
      ];

      setname(userData[2]);
      setLastName(userData[3]);
      setEmail(userData[0]);
      setDni(userData[1]);

      if (response.licenceLevel === 0) {
        setLicence("Sin Carnet");
      }
      if (response.licenceLevel === 1) {
        setLicence("Regular");
      }
      if (response.licenceLevel === 2) {
        setLicence("Confiado");
      }
      if (response.licenceLevel === 3) {
        setLicence("Investigador");
      }
    } catch (error) {
      console.error("Error in:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
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
        <View key={0} style={styles.page}>
          <Text style={styles.instruction}>
            Ingrese el email del usuario registrado o ingrese el QR.
          </Text>
          <CustomTextInput
            placeholder={"email"}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleLoadingData}>
            <Text style={styles.buttonText}>Buscar Usuario</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonQR} onPress={handleLoadingData}>
            <Text style={styles.buttonText}>Ingresar QR</Text>
          </TouchableOpacity>
        </View>
        <View key={1} style={styles.page}>
          <TableDataUser
            name={name}
            lastName={lastName}
            email={email}
            dni={dni}
            licence={licence}
          ></TableDataUser>
          <TouchableOpacity
            style={styles.button}
            onPress={gotoUpdatingUserData}
          >
            <Text style={styles.buttonText}>Modificar datos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={upgradeLicenseLevel}>
            <Text style={styles.buttonText}>Mejorar nivel de carnet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={unsubscribeUser}>
            <Text style={styles.buttonText}>Dar de baja</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (handleNextPage(0), setInputValue(""))}
          >
            <Text
              style={{
                color: "#3369FF",
                fontSize: 14,
                textDecorationLine: "underline",
              }}
            >
              {"Buscar otro usuario >>"}{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <View key={2} style={styles.page}>
          <Text>Ingrese el nuevo dato del usuario: </Text>
          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder={selectedValue}
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />

            <TouchableOpacity
              style={styles.buttonUpdateData}
              onPress={upgradeData}
            >
              <Text style={styles.textButtonUpdateData}>Actualizar</Text>
            </TouchableOpacity>
          </View>
          <Dropdown
            options={options}
            onValueChange={handleValueChange}
            selectedValue={selectedValue}
          />
        </View>
        <View key={3} style={styles.page}>
          <Text style={styles.instruction}>
            Cambiar nivel de carnet del usuario a{" "}
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLevel(2)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Confiado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLevel(3)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Investigador</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleNextPage(1)}>
            <Text
              style={{
                color: "#3369FF",
                fontSize: 14,
                textDecorationLine: "underline",
              }}
            >
              {"Actualizar otros datos o dar de baja>>"}{" "}
            </Text>
          </TouchableOpacity>
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
});
export default CRUDuser;
