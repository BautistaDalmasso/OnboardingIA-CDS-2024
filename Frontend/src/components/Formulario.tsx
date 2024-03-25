import React,{useState, useEffect} from 'react';
import { Button ,SafeAreaView, StyleSheet, Text,TextInput, StatusBar } from 'react-native';

export const Formulario = ( ) => {

const [nombre, set_nombre]= useState("")
const [apellido, set_apellido]= useState("")
const [email, set_email]= useState("")

return (
  
<SafeAreaView style={ styles.container}>
<Text style={styles.titulo}>  Formulario de Registro  </Text>
<TextInput style={styles.input} value={nombre} onChangeText={set_nombre} placeholder='Ingrese su nombre ...'/> 
<TextInput style={styles.input} value={apellido} onChangeText={set_apellido} placeholder='Ingrese su apellido ...'/>  
<TextInput style={styles.input} value={email} onChangeText={set_email} placeholder='Ingrese su email ...'/>   

<Button  title="Enviar"   />

</SafeAreaView>

);
}


const styles = StyleSheet.create({
container:{    
    flex: 1,
    backgroundColor: '#ecf0f1',
    top:50,
    paddingTop:StatusBar.currentHeight
},
input:{
  height:40,
  margin:12,
  padding:10,
  borderWidth:1
}
,
titulo: {
fontSize:22,
padding:10,
}


});
