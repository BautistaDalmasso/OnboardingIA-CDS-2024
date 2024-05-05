import { NavigationProp } from "@react-navigation/native";
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Routes } from "../common/enums/routes";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Loans = ({ navigation }: Props) => {

  const handleBookListNavigation = () => {
    navigation.navigate(Routes.BookList);
  };

  return (
    <View style={styles.container}>
      <Text>Componente de Préstamos</Text>
      <TouchableOpacity style={styles.button} onPress={handleBookListNavigation}>
        <Text style={styles.buttonText}>Ver Lista de Libros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Loans;
