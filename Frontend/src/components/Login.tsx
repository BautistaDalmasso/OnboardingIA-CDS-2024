import React from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native";
import useBiometrics from "../hooks/useBiometrics";


interface LoginProps {
  navigation: any;
}

export const Login = ( props: LoginProps) => {
  const { authenticate, isAuthenticated} = useBiometrics();
  const mostrar_Alerta = () => {    
  };
  
  
  return (
    <SafeAreaView  style={styles.container}>
      <Text style={styles.titulo}>
        ¡Bienvenido!
      </Text> 
      <Text style={styles.text}>
        a la App de Biblioteca Skynet
      </Text> 
    <TouchableOpacity style={styles.button}  onPress={()=>props.navigation.navigate('Registro')}>
        <Text style={styles.buttonText}>REGISTRARSE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={authenticate}>
        {isAuthenticated ? (
          props.navigation.navigate('Home')
        ) : (
          mostrar_Alerta()
        )}
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
              
          
      </TouchableOpacity>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
     alignItems: "center",
     alignContent:"center",
    
     
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    
  },
  logo: {
    alignSelf: 'center',
   height: 200,
   width: 250,
 },

 titulo: {
  margin: 24,
  fontSize: 30,
  fontWeight: 'bold',
  alignSelf: 'center',
},

text: {
  margin: 24,
  fontSize: 15,
  fontWeight: 'bold',
  alignSelf: 'center',
},
alerta: {
  margin: 24,
  fontSize: 15,
  color:"red",
  fontWeight: 'bold',
  alignSelf: 'center',
},

});
