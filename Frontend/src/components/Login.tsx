import React from "react";
import { TouchableOpacity, Button, Text } from "react-native";
import useBiometrics from "../hooks/useBiometrics";

export const Login = () => {
  const { authenticate, desauthenticate, isAuthenticated } = useBiometrics();

  return (
    <TouchableOpacity onPress={authenticate}>
      {isAuthenticated ? (
        <>
          <Text style={{ textAlign: "center", margin: 10 }}>
            Sesión iniciada
          </Text>
          <Button
            title="Cerrar sesión"
            onPress={desauthenticate}
            color={"red"}
          ></Button>
        </>
      ) : (
        <Button title="Iniciar sesión" onPress={authenticate}></Button>
      )}
    </TouchableOpacity>
  );
};
