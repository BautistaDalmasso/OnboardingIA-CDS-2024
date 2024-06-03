import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { LibraryService } from "../../services/LibraryService";
import { IBookWithLicence } from "../../common/interfaces/Book";
import { useContextState } from "../../ContexState";
import BookListItem from "./BookListItem";
import SearchBarComponent from "./BooksSearchBar";
import useUserLoans from "../../hooks/useUserLoans";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";

const RequestLoans = () => {
  const { reserveBook } = useUserLoans();
  const [books, setBooks] = useState<IBookWithLicence[]>([]);
  const { contextState } = useContextState();
  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("title");
  const {
    setIsAtLastPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    isAtLastPage,
  } = usePagination();

  const isBookRequested = (isbn: string) => {
    return contextState.loans.some((loan) => loan.catalogue_data.isbn === isbn);
  };

  const fetchBooks = async () => {
    try {
      const books = await LibraryService.getBooks(currentPage);
      if (books.length > 0) {
        setIsAtLastPage(false);
        setBooks(books);
      } else {
        setIsAtLastPage(true);
      }
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

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
              handleLoanRequest={() => reserveBook(book.book_data.isbn)}
              handleButtonSearch={conductSearchByButton}
            />
          </View>
        ))}
      </ScrollView>
      <Pagination
        currentPage={currentPage}
        isAtLastPage={isAtLastPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
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

export default RequestLoans;
