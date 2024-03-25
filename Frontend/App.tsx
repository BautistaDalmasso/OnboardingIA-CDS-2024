import React from "react";
import { StyleSheet, View } from "react-native";
import { Login } from "./src/components/Login";
import { Formulario } from "./src/components/Formulario";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

export default function App() {
  const Stack =createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" 
       component={Login}
      />
    
        <Stack.Screen name="Formulario" 
       component={Formulario}
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
