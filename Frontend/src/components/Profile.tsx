import React from "react";
import { Routes } from "../common/enums/routes";

import { StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native";


interface Props {
  navigation: any;
}

export const Profile = ({ navigation }: Props ) => {
  const handleSignUp = () => {
    
    navigation.navigate(Routes.SignIn);
  };
  return (
    <SafeAreaView  style={styles.container}>
    <Text style={styles.text}>Bienvenid@, para ingresar a su perfil 
    debe Registrarse o identificarse con su huella digital.</Text>
    <TouchableOpacity style={styles.button} onPress={handleSignUp} >
        <Text style={styles.buttonText}>REGISTRARSE</Text>
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
  textAlign: 'center',
},

});
export default Profile;