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

interface Props {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const [showSignup, setShowSignup] = useState(true);
  const [showUnlock, setShowUnlock] = useState(false);
  const [isConnected, setConnected] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setConnected(await ConnectionService.isConnected());
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();

    return () => {
    };
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
    // TODO: navigate to face login page
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
    if (!await tryReconnect()) {
        Alert.alert("Reconexión fallida.");
    }
  }

  const tryReconnect = async () => {
    const result = await ConnectionService.isConnected();

    setConnected(result);

    return result
  }

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

      {isConnected && <View style={styles.buttonsContainer}>
        {contextState.accessToken === null && (
          <>
            <View style={styles.loginButtonsContainer}>
              {showSignup && (
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleShowButtons}
                >
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
              )}

              {showUnlock && (
                <>
                  <Text style={styles.instruction}>Elija una opción para Ingresar:</Text>
                  <View style={styles.unlockButtonsContainer}>
                    <TouchableOpacity
                      style={styles.fingerButton}
                      onPress={handleLoginFinger}
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
              >
                <Text style={styles.signupButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>}
      {!isConnected &&
        <TouchableOpacity
        style={styles.signupButton}
        onPress={handleReconnect}
      >
        <Text style={styles.signupButtonText}>Reconectar</Text>
      </TouchableOpacity>
      }
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
});

export default Home;
