import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Routes } from "../../common/enums/routes";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import { useContextState } from "../../ContexState";
import { UserService } from "../../services/userService";
import { IDniData, IUser } from "../../common/interfaces/User";
import useQr from "../../hooks/useQr";
import ScanDni from "./ScanDni";

interface Props {
  navigation: NavigationProp<any, any>;
}

const RequestLicence = ({ navigation }: Props) => {
  const [dni, setDni] = useState("");
  const [showDniInput, setShowDniInput] = useState(false);
  const { contextState, setContextState } = useContextState();
  const { forceUpdateQr } = useQr();
  const [licenceAcquired, setLicenceAcquired] = useState(false);

  const handleLicenceNavigation = () => {
    navigation.navigate(Routes.Carnet);
  };

  useEffect(() => {
    if (licenceAcquired && contextState) {
      handleLicenceNavigation();
      setLicenceAcquired(false);
    }
  }, [licenceAcquired, contextState.user?.dni]);

  const handleSendPress = async () => {
    try {
      const result = await UserService.acquireBasicLicence(
        dni,
        contextState.accessToken as string,
      );

      setContextState((state) => ({
        ...state,
        accessToken: result.access_token,
        user: {
          ...state.user,
          dni,
          licenceLevel: result.licence_level,
        } as IUser,
      }));

      await forceUpdateQr(result.access_token, contextState.user);

      setShowDniInput(false);

      Alert.alert("¡Felicidades!", "A solicitado su carnet con exito");
      setLicenceAcquired(true);
    } catch (error) {
      Alert.alert("Error", "No se pudo solicitar su carnet");
    }
  };

  if (showDniInput) {
    return (
      <>
        <ScanDni
          onDniScanned={(dni: IDniData) => {
            setDni(dni.dni);
            setShowDniInput(false);
          }}
          onCancel={() => setShowDniInput(false)}
        />
      </>
    );
  }

  if (dni !== "") {
    return (
      <View style={styles.container}>
        <Text style={styles.saludo}>Solicitando Carnet...</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={dni}
            editable={false}
            maxLength={11}
          />
          <TouchableOpacity onPress={handleSendPress}>
            <Text style={{ color: "#007AFF", fontSize: 26 }}>✔</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => handleSendPress()}
          >
            <Text style={styles.buttonTextContainer}>Confirmar DNI</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.saludo}>¡Hola {contextState.user?.firstName}!</Text>
      {!contextState.user?.dni && (
        <>
          <Text style={styles.instruction}>Aún no tienes un carnet</Text>
          <Text style={styles.instruction}>
            Escanea tu DNI para obtener uno
          </Text>
          <View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setShowDniInput(true)}
            >
              <Text style={styles.buttonTextContainer}>Solicitar Carnet</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "50%",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  saludo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3369FF",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3369FF",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  instruction: {
    fontSize: 26,
    color: "#666",
    marginTop: 50,
  },
  buttonContainer: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "100%",
    margin: 50,
    maxWidth: 215,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextContainer: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 50,
    marginHorizontal: 40,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 5,
    marginRight: 10,
    width: 200,
    fontSize: 12,
  },
  imageBackground: {
    width: 305,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    resizeMode: "cover",
    textAlign: "left",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3369FF",
    textAlign: "center",
    marginBottom: 20,
  },
  outerContainer: {
    justifyContent: "center",
    height: "50%",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  nameCarnet: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
  },
  dniCarnet: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "left",
  },
  emailCarnet: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
  },
  companyCarnet: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
  },
  innerContainer: {
    width: 305,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    resizeMode: "cover",
    textAlign: "left",
  },
});

export default RequestLicence;
