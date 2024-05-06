import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";
import { LibraryService } from "../services/LibraryService";
import { IBook } from "../common/interfaces/Book";

const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await LibraryService.getBooks();
        setBooks(books);
      } catch (error) {
        console.error('Error al obtener libros:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleBorrow = async (isbn: string) => {
    //TODO
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Libros</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {books.map((book) => (
          <View key={book.isbn} style={styles.bookContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.cardLevel}>Carnet: {book.licence_required}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleBorrow(book.isbn)}
            >
              <Text style={styles.buttonText}>Solicitar</Text>
            </TouchableOpacity>
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
  cardLevel: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default BookList;
