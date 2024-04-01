import React, { useState } from 'react';
import { Routes } from "../../src/common/enums/routes";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

interface Props {
  navigation: any;
}

const Profile = ({ navigation }: Props ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showInputs, setShowInputs] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const handleLoginWithPassword = () => {
    setShowInputs(true);
  };
  const handleLoginWithFingerPrint=()=>{
    Alert.alert ('Por favor','Ingrese su huella digita.')

  }
  const handleLogin = async () => {
    const auth = getAuth();
    if (!emailRegex.test(email) || password.length < 6){
      Alert.alert('Por favor','Ingrese un correo valido y una contraseña de 6 caracteres. ');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;


      console.log('User logged in:', user);

      setEmail('');
      setPassword('');

      setShowInputs(false);
      navigation.navigate(Routes.Home);
    } catch (error) {
      console.error('Error logging in:', error);

    if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
      Alert.alert('Error', 'Usted no se encuentra registrado.');
    } else if (error instanceof FirebaseError && error.code === 'auth/wrong-password') {
      Alert.alert('Error', 'La contraseña es incorrecta.');
    } else if (error instanceof FirebaseError && error.code === 'auth/invalid-email') {
      Alert.alert('Error', 'Por favor ingrese un email valido.');
    } else {
      Alert.alert('Error', 'error inesperado.');
    }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresar a Perfil con: </Text>

      {showInputs ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="  Ingresar email"
            value={email}
            onChangeText={text => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="  Ingresar contraseña"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLoginWithPassword}>
          <Text style={styles.buttonText}>Email y Contraseña</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLoginWithFingerPrint} >
        <Text style={styles.buttonText}>Huella Digital</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          ¿No estas registrado?
          </Text>
          <Text
            style={styles.signupLink}
            onPress={() => {
               navigation.navigate(Routes.SignUp);
            }}
          >
            Registrese
          </Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    top: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
});

export default Profile;

