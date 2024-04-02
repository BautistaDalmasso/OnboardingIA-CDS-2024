import React, { useState } from 'react';
import {StyleSheet,Text,TextInput,View,TouchableOpacity, Keyboard} from 'react-native';
import { firebaseConfig } from '../../firebase';
import { initializeApp } from 'firebase/app';
import {getFirestore, setDoc,doc}from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Form = () => {
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit =async () => {
    Keyboard.dismiss();

    if (!name || !lastName) {
      alert('Por favor complete el formulario antes de enviar.');
      return;
    }
    if (!emailRegex.test(email)){
      alert('Por favor ingrese un correo valido.');
      return;
    }
    if (password.length < 6){
      alert('Por favor ingrese una contraseña de 6 caracteres.');
      return;
    }
    try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
     
    const userRef = doc(db, 'users', user.uid);
    //const userRef = doc(db, 'users', name + lastName);
      await setDoc(userRef, {
        name,
        lastName,
        email,
      });

      console.log('User data saved successfully!');
      alert('¡Usted ha sido registrado con exito!.');
      // Clear form fields
      setName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error saving user data:', error);
    }

    console.log('Name:', name);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
   
    setName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
       <Text style={styles.label}> Formulario</Text>
      <TextInput
        placeholder='Ingrese su nombre ...'
        style={styles.input}
        value={name}
        onChangeText={text => setName(text) }
      />
      <TextInput
        placeholder='Ingrese su apellido ...'
        style={styles.input}
        value={lastName}
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        placeholder='Ingrese su email ...'
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
      />
     
      <TextInput
        placeholder='Ingrese una contraseña ...'
        style={styles.input}
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10
  },
  label: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default Form;
