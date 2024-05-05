import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ServerAddress } from "../common/consts/serverAddress";

interface Book {
  isbn: string;
  title: string;
  available_copies: number;
  licence_required: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${ServerAddress}books`);
      if (!response.ok) {
        throw new Error("Response error");
      }
      const data = await response.json();
      console.log(data);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleBorrow = async (isbn: string) => {
    try {
      const response = await fetch(`${ServerAddress}/books/${isbn}/borrow/`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Response error');
      }
      console.log('Successful loan application');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Libros</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {books.map((book) => (
          <View key={book.isbn} style={styles.bookContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.cardLevel}>Carnet: {book.licence_required.toString()}</Text>
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
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
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
});

export default BookList;
