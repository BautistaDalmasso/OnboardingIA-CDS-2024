import React from "react";
import { StatusBar, StyleSheet, SafeAreaView, TouchableOpacity, Button, Text } from "react-native";
import useBiometrics from "../hooks/useBiometrics";


interface LoginProps {
  navigation: any;
}

export const Login = ( props: LoginProps) => {
  const { authenticate, desauthenticate, isAuthenticated } = useBiometrics();

  return (
    <SafeAreaView  style={styles.container}>
      <Button
        title="Registrarse"
        onPress={()=>props.navigation.navigate('Formulario')}
        color={"blue"}
      />
      <TouchableOpacity onPress={authenticate}>
        {isAuthenticated ? (
          <>
            <Text style={{ textAlign: "center", margin: 10 }}>
              Sesión iniciada
            </Text>
            <Button title="Cerrar sesión" onPress={desauthenticate} color={"red"}></Button>
          </>
        ) : (
          <Button title="Iniciar sesión" onPress={authenticate}></Button>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    
  },
});
