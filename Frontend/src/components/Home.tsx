import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Routes } from "../common/enums/routes";
import { useContextState } from "../ContexState";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: Props) => {
  const { contextState } = useContextState();
  const [showSignup, setShowSignup] = useState(true);
  const [showUnlock, setShowUnlock] = useState(false);

  const handleContinue = () => {
    navigation.navigate(Routes.Login);
  };

  const handleLogin = () => {
    navigation.navigate(Routes.Login);
  };

  const handleSignup = () => {
    navigation.navigate(Routes.Signup);
  };

  const handleShowButtons = async () => {
    setShowUnlock(true)
    setShowSignup(false)
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Image
          source={require("../assets/logo-skynet.png")}
          style={styles.image} resizeMode="contain" />
        <Text style={styles.subtitle}>
          La mejor app para gestionar los libros de tu biblioteca
        </Text>
      </View>


      <View style={styles.buttonsContainer}>
        {contextState.accessToken === null ? (
          <>
            <View style={styles.loginButtonsContainer}>
              {showSignup &&
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleShowButtons}
                >
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
              }
              {showUnlock
                &&
                <View style={styles.unlockButtonsContainer}>

                  <TouchableOpacity style={styles.unlockButton}
                    onPress={handleLogin}>
                    <Image
                      source={require("../assets/fingerprint.png")}
                      style={styles.iconUnlock}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.unlockButton}
                    onPress={handleLogin}>
                    <Image
                      source={require("../assets/face.png")}
                      style={styles.iconUnlock}
                      resizeMode="contain"
                    /></TouchableOpacity>
                  <TouchableOpacity style={styles.unlockButton}
                    onPress={handleLogin}>
                    <Image
                      source={require("../assets/password.png")}
                      style={styles.iconUnlock}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              }

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
              >
                <Text style={styles.signupButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.continueLink} onPress={handleContinue}>
              {"Ingresar sin conexión >>"}
            </Text>

          </>
        ) : (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.loginButtonText}>Ir al Chat</Text>
          </TouchableOpacity>
        )}
      </View>
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
    color: "#098fea",

    textAlign: "center",
    bottom: 15,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 60,
    bottom: 40,
    color: "#191A1A",
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
    backgroundColor: "#098fea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#098fea",
  },
  signupButton: {
    marginBottom: 80,
    backgroundColor: "#ffffff",
    borderColor: "#098fea",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,

  },
  continueLink: {
    color: "#098fea",
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
    color: "#098fea",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  unlockButtonsContainer: {
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "85%",
  }, 
  continueButton: {
    backgroundColor: "#3369FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#3369FF",
    width: "85%",
  },
  unlockButton: {
    backgroundColor: "#098fea",
    borderRadius: 100,
    borderWidth: 10,
    borderColor: "#098fea",
    margin: 10,
  },
  iconUnlock: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },

});

export default Home;
