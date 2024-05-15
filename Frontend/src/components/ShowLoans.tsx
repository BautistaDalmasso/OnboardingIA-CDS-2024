import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ILoanWithTitle } from "../common/interfaces/Book";

const ShowLoans = () => {
  const [books, setBooks] = useState<ILoanWithTitle[]>([]);

  useEffect(() => {
    const loadBooksFromAsyncStorage = async () => {
      try {
        const jsonData = await AsyncStorage.getItem("Loans");
        if (!jsonData) {
          console.log("No hay datos guardados en AsyncStorage.");
          return;
        }

        const data = JSON.parse(jsonData);
        setBooks(data);
      } catch (error) {
        console.error("Error al cargar los datos desde AsyncStorage:", error);
      }
    };

    loadBooksFromAsyncStorage();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Préstamos solicitados</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Array.isArray(books) &&
          books.map((book) => (
            <View key={book.isbn} style={styles.bookContainer}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              {book.expiration_date && (
                <Text style={styles.expirationDate}>
                  Fecha de vencimiento: {book.expiration_date.toString()}
                </Text>
              )}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  bookContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  expirationDate: {
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
});

export default ShowLoans;
