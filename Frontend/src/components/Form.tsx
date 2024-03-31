import React,{useState } from 'react';
import { Keyboard,TouchableOpacity ,SafeAreaView, StyleSheet, Text,TextInput} from 'react-native';
import { initializeApp } from 'firebase/app';

import { firebaseConfig } from '../../firebase';

import {getFirestore, addDoc, collection}from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const  Form = ( ) => {
  const initialState = {
    name: '',
    lastName: '',
    email: '',
  };

  const [state, setState] = useState(initialState);

  const handleChangeText = (value: string, name: string) => {
   
    setState({ ...state, [name]: value });
  };

 const saveUser = async () =>{

try{
  await addDoc (collection(db,'users'),{ ...state})
  alert("Usted a sido registrado.")

}catch{

console.error(console.error);

}

 
 } 

 return (
  <SafeAreaView style={ styles.container}>
  <Text style={styles.titulo}>  Formulario  </Text>
  <TextInput style={styles.input} value={state.name}  placeholder='Ingrese su nombre ...' onChangeText={(value) => handleChangeText(value, 'name')}/> 
  <TextInput style={styles.input} value={state.lastName}  placeholder='Ingrese su apellido ...' onChangeText={(value) => handleChangeText(value, 'lastName')}/>  
  <TextInput style={styles.input} value={state.email} placeholder='Ingrese su email ...' onChangeText={(value) => handleChangeText(value, 'email')}/>   
  <TouchableOpacity style={styles.button} >
  <Text style={styles.buttonText} onPress={saveUser}>Enviar</Text>
  </TouchableOpacity>
  </SafeAreaView>
  

 )
;
}


const styles = StyleSheet.create({
container:{    
  backgroundColor: '#ecf0f1',
  top:50,
},
input:{
  height:40,
  margin:12,
  padding:10,
  borderWidth:1,
}
,
titulo: {
fontSize:22,
padding:10,
justifyContent: 'center',
textAlign: 'center',
},  
button: {
  backgroundColor: "#3369FF",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 100,
  width: "30%",
},
buttonText: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "bold",
},
});

export default Form;
