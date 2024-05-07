import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { LibraryService } from "../services/LibraryService";
import { LoanService } from "../services/LoanManagementService";
import {
  IRequestedBook,
  IBookWithLicence,
  IBook,
  ILoan,
  ILoanWithTitle,
} from "../common/interfaces/Book";
import { useContextState } from "../ContexState";
import AsyncStorage from "@react-native-async-storage/async-storage";

//TODO: refactor
const BookList = () => {
  const [books, setBooks] = useState<IBookWithLicence[]>([]);
  const { contextState } = useContextState();
  const [requestState, setRequestState] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [requestedBooks, setRequestedBooks] = useState<string[]>([]);

  const handleRequest = (isbn: string) => {
    setRequestedBooks([...requestedBooks, isbn]);
  };

  const isBookRequested = (isbn: string) => {
    return requestedBooks.includes(isbn);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await LibraryService.getBooks();
        setBooks(books);
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleLoanRequest = async (book: IBookWithLicence) => {
    if (contextState.accessToken === null) {
      throw Error("Access token is null.");
    }
    if (contextState.user?.email === undefined) {
      throw Error("User email is undefined.");
    }
    const requestData = {
      isbn: book.isbn,
      copy_id: book.available_copies.toString(),
      user_email: contextState.user?.email,
    };

    try {
      const response = await LoanService.createRequestedBook(
        requestData,
        contextState.accessToken,
      );
      //To fix: it doesn't catch all the errors, it's just a temporary solution
      if (response === null) {
        handleConfirmedLoan(requestData,book.title);
        handleRequest(book.isbn);
        handleBorrow(book);

      } else {
        Alert.alert("Error: diferente nivel de carnet");
      }
    } catch {
      setRequestState("Error");
    }
  };

  const handleConfirmedLoan = async (book: IRequestedBook, title: string) => {
    if (contextState.user?.email === undefined) {
      throw Error("User email is undefined.");
    }
    const today: Date = new Date();
    const futureDate: Date = new Date(today);
    futureDate.setDate(futureDate.getDate() + 7);

    const requestData = {
      isbn: book.isbn,
      copy_id: book.copy_id,
      expiration_date: futureDate,
      user_email: contextState.user?.email,
    };
    try {
      const response = await LoanService.addConfirmedLoan(requestData);
      console.log(response);
      handleJSON({
        title: title,
        expiration_date: futureDate,
        isbn: book.isbn,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error");
    }
  };

  const handleBorrow = async (book: IBook) => {
    try {
      const response = await LibraryService.handleBorrow(book);
      if (response.status === "borrowed") {
        setButtonDisabled(true);
        Alert.alert("Success");
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Error");
    }
  };

  /*TEMPORARY SOLUTION TO SHOW USER LOANS OFFLINE (many users trying to use "show loans" may cause trouble
    and increasing storage may increase memory shortage )
  */
  const handleJSON = async (requestData: ILoanWithTitle) => {
    try {
      const jsonData = JSON.stringify(requestData);
      await AsyncStorage.setItem("requestData", jsonData);
      console.log("Datos guardados correctamente en AsyncStorage.");
    } catch (error) {
      console.error("Error al guardar los datos en AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Libros</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {books.map((book) => (
          <View key={book.isbn} style={styles.bookContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.cardLevel}>
              Carnet: {book.licence_required}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isBookRequested(book.isbn)
                    ? "#ccc"
                    : "#007bff",
                },
              ]}
              onPress={() => handleLoanRequest(book)}
              disabled={isBookRequested(book.isbn)}
            >
              <Text style={styles.buttonText}>
                {isBookRequested(book.isbn) ? "Solicitado" : "Solicitar"}
              </Text>
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
