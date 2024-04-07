import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, Keyboard } from 'react-native';


const Profile = () => {
  
  const [dni, setDni] = useState('');
  const [showDniInput, setShowDniInput] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showCarnet, setShowCarnet] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handlePress = () => {
    setShowDniInput(true);
    setShowButton(false);
  };

  const handleDniInput = (text: string) => {
    setDni(text);

    const input = text.replace(/[^0-9]/g, '');
    if (input.length > 11) {
      setDni(input.substring(0, 11));
    } else {
      setDni(input);
    }
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleSendPress = () => {
    setShowCarnet(true);
    setShowDniInput(false);
    Keyboard.dismiss()
    Alert.alert('¡Felicidades!', 'A solicitado su carnet con exito');
  
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.saludo}> ¡Hola! </Text>
      <Text style={styles.name}>Nombre Apellido </Text>
      <Text style={styles.email}>nombre.apellido@email.com</Text>
     
      {showButton && (
         <View>
         <Text style={styles.instruction}>Bienvenido a tu perfil, puedes:</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
          <Text style={styles.buttonTextContainer}>Solicitar Carnet</Text>
        </TouchableOpacity>
        </View>
      )}
      {showButton && (
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonTextContainer}>Actualizar Datos</Text>
        </TouchableOpacity>
      )}

      {showDniInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={dni}
            onChangeText={handleDniInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Ingrese su dni para obtener su carnet."
            keyboardType='numeric'
            maxLength={11}
          />
          <TouchableOpacity disabled={!dni || !inputFocused} onPress={handleSendPress}>
            <Text style={{ color: '#007AFF', fontSize: 26 }}>✔</Text>
          </TouchableOpacity>
        </View>
      )}
      {showCarnet && (
        <View style={styles.outerContainer}>
          <Text style={styles.title}>Aqui está tu carnet</Text>
          <View style={styles.innerContainer}>
            <ImageBackground source={require('./assets/carnet.png')} style={styles.imageBackground}>
              <Text style={styles.nameCarnet}>Nombre Apellido</Text>
              <Text style={styles.dniCarnet}>DNI</Text>
              <Text style={styles.emailCarnet}>email</Text>
              <Text style={styles.companyCarnet}>Skynet</Text>
            </ImageBackground>
          </View>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.buttonTextContainer}>Actualizar carnet</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

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
    fontWeight: 'bold',
    color: "#3369FF",
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#3369FF",
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  instruction: {
    marginTop: 30,
    marginBottom: 30,
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 50,
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
    fontWeight: 'bold',
    color: "#3369FF",
    textAlign: "center",
  },
  outerContainer: {
   
    justifyContent: "center",
    height: "50%",
    alignItems: "center",
    backgroundColor: "#ffffff",
 },nameCarnet: {
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
  },innerContainer: {
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

export default Profile;