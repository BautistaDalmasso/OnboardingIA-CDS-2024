import React from 'react';
import {BackHandler,Button ,SafeAreaView, StyleSheet, Text,TextInput, StatusBar } from 'react-native';
//import useBiometrics from "../hooks/useBiometrics";

export const SesionIniciada = ( ) => {
   // const { desauthenticate } = useBiometrics();

return (

    <SafeAreaView  style={styles.container}>
    <Text style={{ textAlign: "center", margin: 10 }}>
        Sesión iniciada
    </Text>
    <Button title="Cerrar sesión" onPress={()=>BackHandler.exitApp()} color={"red"}></Button>
    
    
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
       alignItems: "center",
       justifyContent: "center",
       
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 13,
      
    },
  });
  