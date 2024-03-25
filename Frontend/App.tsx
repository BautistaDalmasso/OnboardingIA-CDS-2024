
import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Login } from "./src/components/Login";
import { Formulario } from "./src/components/Formulario";
import { SesionIniciada } from "./src/components/SesionIniciada";


export default function App() {
  const Stack =createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" 
       component={Login}
      />
       <Stack.Screen name="Registro" 
       component={Formulario}
      />
      <Stack.Screen name="Home" 
       component={SesionIniciada}
      />
 
      </Stack.Navigator>
    );
  }
  return (
    <NavigationContainer >
      <MyStack />
    </NavigationContainer>
  );
}
