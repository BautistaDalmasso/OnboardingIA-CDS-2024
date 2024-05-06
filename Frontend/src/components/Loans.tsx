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
      <Text style={styles.title}>Préstamos</Text>
      <TouchableOpacity style={styles.button} onPress={handleBookListNavigation}>
        <Text style={styles.buttonText}>Solicitar préstamos</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Loans;
