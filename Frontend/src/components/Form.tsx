import React,{useState } from 'react';
import {TouchableOpacity ,SafeAreaView, StyleSheet, Text,TextInput} from 'react-native';


export const  Form = ( ) => {

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
return (
<SafeAreaView style={ styles.container}>
<Text style={styles.titulo}>  Formulario  </Text>
<TextInput style={styles.input} value={name} onChangeText={setName} placeholder='Ingrese su nombre ...'/> 
<TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder='Ingrese su apellido ...'/>  
<TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Ingrese su email ...'/>   
<TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Enviar</Text>
</TouchableOpacity>
</SafeAreaView>

);
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
