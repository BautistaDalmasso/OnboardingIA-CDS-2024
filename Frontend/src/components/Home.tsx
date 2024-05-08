import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Routes } from "../common/enums/routes";
import { useContextState } from "../ContexState";
import { ConnectionService } from "../services/connectionService";
import useBiometrics from "../hooks/useBiometrics";
import { ConnectionType } from "../common/enums/connectionType";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: Props) => {
  const { contextState, setContextState } = useContextState();
  const { authenticate } = useBiometrics();
  const [showSignup, setShowSignup] = useState(true);
  const [showUnlock, setShowUnlock] = useState(false);
  const [loading, setLoading] = useState(true);

  const setConnection = async () => {
    try {
      const response = await ConnectionService.isConnected();

      setContextState((state) => ({
        ...state,
        isConnected: response,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setConnection();
    setLoading(false);

    return () => {};
  }, []);

  const handleLoginFinger = async () => {
    navigation.navigate(Routes.LoginFingerprint);
    await handleShowButtons();
  };

  const handleLoginPassword = async () => {
    navigation.navigate(Routes.Login);
    await handleShowButtons();
  };

  const handleLoginFace = async () => {
    navigation.navigate(Routes.LoginFace);
    await handleShowButtons();
  };

  const handleSignup = async () => {
    navigation.navigate(Routes.Signup);
    await handleShowButtons();
  };

  const handleShowButtons = async () => {
    setShowUnlock(!showUnlock);
    setShowSignup(!showSignup);

  };

  const handleReconnect = async () => {
    setLoading(true);
    await setConnection();
    if (!contextState.isConnected) {
      Alert.alert("Reconexión fallida.");
    }
    setLoading(false);
  };

  const handleOfflineAuth = async () => {
    setLoading(true);

    const successBiometric = await authenticate();

    if (successBiometric) {
      setContextState((state) => ({
        ...state,
        connectionType: ConnectionType.OFFLINE,
        userOffline: true,
      }));
      navigation.navigate(Routes.MyLoans);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>¡Bienvenido!</Text>

        <Image
          source={require("../assets/logo-skynet.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          La mejor app para gestionar los libros de tu biblioteca
        </Text>
      </View>

      {contextState.isConnected && (
        <View style={styles.buttonsContainer}>
          {contextState.accessToken === null && (
            <>
              <View style={styles.loginButtonsContainer}>
                {showSignup && (
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleShowButtons}
                    disabled={loading}
                  >
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  </TouchableOpacity>
                )}

                {showUnlock && (
                  <>
                    <Text style={styles.instruction}>
                      Elija una opción para Ingresar:
                    </Text>
                    <View style={styles.unlockButtonsContainer}>
                      <TouchableOpacity
                        style={styles.fingerButton}
                        onPress={handleLoginFinger}
                        disabled={loading}
                      >
                        <Image
                          source={require("../assets/fingerprint.png")}
                          style={styles.fingerprintIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.fingerButton}
                        onPress={handleLoginFace}
                        disabled={loading}
                      >
                        <Image
                          source={require("../assets/face.png")}
                          style={styles.fingerprintIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.fingerButton}
                        onPress={handleLoginPassword}
                        disabled={loading}
                      >
                        <Image
                          source={require("../assets/password.png")}
                          style={styles.fingerprintIcon}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <Text style={styles.signupButtonText}>Registrarse</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
      {!contextState.isConnected && (
        <View>
          <View style={styles.noConnContainer}>
            <Text style={styles.noConnTitle}>
              ¡U! no tienes conexion a Internet :'(
            </Text>
            <Text>Por favor verifica tu conexion a Internet.</Text>
            <Text style={styles.noConnSubtitle}>
              {" "}
              Igual puedes Ingresar a SKYNET :D
            </Text>
            {contextState.connectionType !== ConnectionType.OFFLINE && (
              <>
                <TouchableOpacity
                  style={styles.noConnButton}
                  onPress={handleOfflineAuth}
                  disabled={loading}
                >
                  <Text style={styles.noConnButtonText}>
                    Ingresar sin conexion
                  </Text>

                  <Image
                    source={require("../assets/fingerprint.png")}
                    style={styles.fingerprintIconLogin}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.noConnButton}
              onPress={handleReconnect}
              disabled={loading}
            >
              <Text style={styles.noConnButtonText}>Reconectar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    marginTop: 200,
    fontSize: 40,
    fontWeight: "bold",
    color: "#48bce4",
    textAlign: "center",
    bottom: 15,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 60,
    bottom: 40,
    color: "#646464",
  },
  image: {
    height: 150,
    bottom: 10,
    width: 250,
    alignSelf: "center",
  },

  buttonsContainer: {
    marginTop: 200,
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
    bottom: 100,
  },
  loginButtonsContainer: {
    justifyContent: "center",
    width: "85%",
  },
  loginButton: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#48bce4",
  },
  fingerButton: {
    backgroundColor: "#48bce4",
    borderRadius: 100,
    borderWidth: 10,
    borderColor: "#48bce4",
    margin: 10,
  },
  signupButton: {
    marginBottom: 150,
    backgroundColor: "#ffffff",
    borderColor: "#48bce4",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  continueLink: {
    color: "#48bce4",
    marginTop: 50,
    textAlign: "center",
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupButtonText: {
    color: "#48bce4",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  fingerprintIcon: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  unlockButtonsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "85%",
  },
  instruction: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#48bce4",
  },
  button: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  noConnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  noConnTitle: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
    color: "red",
  },

  noConnSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 40,
    textAlign: "center",
    color: "#48bce4",
  },

  noConnButton: {
    backgroundColor: "#48bce4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  noConnButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  noConnLinkText: {
    color: "#48bce4",
    marginTop: 25,
    textAlign: "center",
  },
  fingerprintIconLogin: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default Home;
