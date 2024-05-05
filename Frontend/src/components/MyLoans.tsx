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
    name: "El secreto",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "2",
    name: "Harry potter",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "4",
    name: "Programacion basica",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "10",
    name: "Phyton",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "14",
    name: "Data base",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "1112",
    name: "booknasadme",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "165",
    name: "booknasadme",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "156",
    name: "booknasadme",
    fecha_vencimiento: '23-04-01',
    fecha_retiro: '23-04-23'
  },
  {
    id: "155",
    name: "booknasadme",
    fecha_vencimiento: '23-04-01',
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
