import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { LibraryService } from "../services/LibraryService";
import { LoanService } from "../services/LoanManagementService";
import {
  IRequestedBook,
  IBookWithLicence,
  ILoanWithTitle,
} from "../common/interfaces/Book";
import { useContextState } from "../ContexState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookListItem from "./BookListItem";
import SearchBarComponent from "./BooksSearchBar";

//TODO: refactor
const RequestLoans = () => {
  const [books, setBooks] = useState<IBookWithLicence[]>([]);
  const { contextState } = useContextState();
  const [requestState, setRequestState] = useState("");
  const [requestedButton, setRequestedButton] = useState<string[]>([]);
  const [requestedBooks] = useState<ILoanWithTitle[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("title");

  const handleRequestedBook = (book: ILoanWithTitle) => {
    requestedBooks.push(book);
  };

  const handleRequestButton = (isbn: string) => {
    setRequestedButton([...requestedButton, isbn]);
  };

  const isBookRequested = (isbn: string) => {
    return requestedButton.includes(isbn);
  };

  const fetchBooks = async () => {
    try {
      const books = await LibraryService.getBooks();
      setBooks(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  useEffect(() => {
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
      isbn: book.book_data.isbn,
      copy_id: 1,
      user_email: contextState.user?.email,
      title: book.book_data.title,
    };

    try {
      const response = await handleConfirmedLoan(
        requestData,
        contextState.accessToken,
      );
      //To fix: it doesn't catch all the errors; ej: no book available
      if (response.detail) {
        Alert.alert("Error: diferente nivel de carnet");
      } else {
        handleRequestButton(book.book_data.isbn);
      }
    } catch {
      setRequestState("Error");
    }
  };

  const handleConfirmedLoan = async (
    book: IRequestedBook,
    accessToken: string,
  ) => {
    if (contextState.user?.email === undefined) {
      throw Error("User email is undefined.");
    }
    const today: Date = new Date();
    const futureDate: Date = new Date(today);
    futureDate.setDate(futureDate.getDate() + 7);

    const requestData = {
      isbn: book.isbn,
      expiration_date: futureDate,
      user_email: book.user_email,
      loan_status: "requested",
    };

    try {
      const response = await LoanService.createRequestedBook(
        requestData,
        accessToken,
      );
      if (!response.detail) {
        handleJSON({
          isbn: book.isbn,
          title: book.title,
          expiration_date: futureDate,
          user_email: book.user_email,
          loan_status: "requested",
        });
      }
      return response;
    } catch (error) {
      console.error(error);
      Alert.alert(`Error: ${error}`);
      return { detail: error };
    }
  };

  const handleJSON = async (requestData: ILoanWithTitle) => {
    try {
      handleRequestedBook(requestData);
      const jsonData = JSON.stringify(requestedBooks);
      await AsyncStorage.setItem("Loans", jsonData);
      console.log("Data saved succesfully on AsyncStorage.");
    } catch (error) {
      console.error("Error saving data on AyncStorage:", error);
    }
  };

  const conductSearch = async () => {
    try {
      let books: IBookWithLicence[] = [];

      if (filterCategory === "isbn") {
        books = await conductSearchByIsbn();
      } else {
        books = await conductSearchByFilter();
      }

      setBooks(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const conductSearchByIsbn = async () => {
    return await LibraryService.getBookByISBN(searchValue);
  };

  const conductSearchByFilter = async () => {
    return await LibraryService.getFilteredBooks(filterCategory, searchValue);
  };

  const conductSearchByButton = async (
    filterCategory: string,
    searchValue: string,
  ) => {
    try {
      const books = await LibraryService.getFilteredBooks(
        filterCategory,
        searchValue,
      );

      setBooks(books);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Libros</Text>
      <SearchBarComponent
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        onSearch={conductSearch}
        onClear={fetchBooks}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {books.map((book) => (
          <View style={styles.bookContainer} key={book.book_data.isbn}>
            <BookListItem
              book={book}
              isBookRequested={isBookRequested}
              handleLoanRequest={handleLoanRequest}
              handleButtonSearch={conductSearchByButton}
            />
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
    width: "100%",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    flexGrow: 1,
    flexShrink: 1,
  },
  cardLevel: {
    fontSize: 16,
    marginBottom: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  button: {
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
    paddingBottom: 200,
  },
});

export default RequestLoans
