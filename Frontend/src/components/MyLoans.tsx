import React from "react";
import { View, Text, StyleSheet, Image, ScrollView , ImageBackground} from "react-native";
import Button from "./Button";
import BookCard from './BookCard';

//TODO: Loan interface

interface Loan {
  isbn: string;
  title: string;
  copyID: string,
  expirationDate: Date,
}

const image = require('../assets/background.png');
const bookList = [
  {
    id: "1",
    name: "Rayuela",
    fecha_vencimiento: '23-05-23',
    fecha_retiro: '23-04-23'
  },
  {
    id: "2",
    name: "Cien años de soledad",
    fecha_vencimiento: '13-04-23',
    fecha_retiro: '03-04-23'
  },
  {
    id: "4",
    name: "Sobre héroes y tumbas",
    fecha_vencimiento: '25-05-23',
    fecha_retiro: '29-04-23'
  },
  {
    id: "10",
    name: "El amor en tiempos de cólera",
    fecha_vencimiento: '01-04-23',
    fecha_retiro: '29-02-23'
  },
  {
    id: "14",
    name: "Crónica de una muerte anunciada",
    fecha_vencimiento: '02-06-23',
    fecha_retiro: '30-04-23'
  },
  {
    id: "1112",
    name: "Martín fierro",
    fecha_vencimiento: '23-07-23',
    fecha_retiro: '06-04-23'
  },
  {
    id: "165",
    name: "Los ojos del perro siberiano",
    fecha_vencimiento: '23-04-23',
    fecha_retiro: '23-02-23'
  },
  {
    id: "156",
    name: "Metamorfosis",
    fecha_vencimiento: '13-04-23',
    fecha_retiro: '02-04-23'
  },
  {
    id: "155",
    name: "El señor de los anillos",
    fecha_vencimiento: '23-05-23',
    fecha_retiro: '23-04-23'
  },

];

const My_loans = () => {
  return (
    <View style={styles.container1}>

  <ImageBackground source={image} resizeMode="cover" style={styles.image}>
     <Text style={styles.title}>Prestamos solicitadados</Text>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {bookList.map(book => (
          <BookCard
            key={book.id}
            title={book.name}
            dueDate={book.fecha_vencimiento}
          />
        ))}
      </ScrollView>
      </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container1: {
      flex: 1,
    },
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  scrollViewContainer: {
    width: '100%',
    alignItems: 'center',
  },

  title: {
    height: 70,
    fontSize: 22,
    textAlign: "center",
    color: '#006694',
    textShadowRadius: 30,
    textShadowColor: '#42FFD3',
    textAlignVertical: 'center',
    marginVertical: 20,
    marginStart: 30,
    fontWeight: 'bold',

  },
  image:{
    flex: 1,
    justifyContent: 'center',
  }
});

export default My_loans;
