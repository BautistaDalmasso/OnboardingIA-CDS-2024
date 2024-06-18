import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, ImageBackground } from "react-native";
import { LibraryService } from "../../services/LibraryService";
import { IBookWithLicence } from "../../common/interfaces/Book";
import { useContextState } from "../../ContexState";
import BookListItem from "./BookListItem";
import SearchBarComponent from "./BooksSearchBar";
import useUserLoans from "../../hooks/useUserLoans";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";
import { BookPage } from "../../common/enums/Page";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const image = require("../../assets/headerBookList.png");

const RequestLoans = () => {
  const { reserveBook } = useUserLoans();
  const [books, setBooks] = useState<IBookWithLicence[]>([]);
  const { contextState } = useContextState();
  const [searchValue, setSearchValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("title");
  const [totalPages, setTotalPages] = useState(0);
  const { goToNextPage, goToPreviousPage, currentPage } = usePagination();

  const scrollViewRef = useRef<ScrollView>(null);

  const isBookRequested = (isbn: string) => {
    return contextState.loans.some((loan) => loan.catalogue_data.isbn === isbn);
  };

  const fetchBooks = async () => {
    try {
      const books = await LibraryService.getBooks(currentPage);

      if (books.length > 0) {
        setBooks(books);
      }
      if (scrollViewRef.current) {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  const totalBooks = async () => {
    try {
      const result = await LibraryService.getCountOfBooks();

      if (result != null) {
        setTotalPages(result.total_books / BookPage.PAGE_SIZE);
      }
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  totalBooks();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.titleHeader}>Lista de Libros</Text>
        </ImageBackground>
        </View>
      <SearchBarComponent
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        onSearch={conductSearch}
        onClear={fetchBooks}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
      >
        {books.map((book) => (
          <View style={styles.bookContainer} key={book.book_data.isbn}>
            <BookListItem
              book={book}
              isBookRequested={isBookRequested}
              handleLoanRequest={() => reserveBook(book.book_data.isbn)}
              handleButtonSearch={conductSearchByButton}
              user={contextState.user}
            />
          </View>
        ))}
      </ScrollView>
      <Pagination
        currentPage={currentPage}
        goToPreviousPage={() => {
          goToPreviousPage();
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }}
        goToNextPage={() => {
          goToNextPage();
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }}
        lastPage={totalPages}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    height: hp('16%'),
    width: wp('100%'),
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  titleHeader: {
    height: hp('7%'),
    width: wp('100%'),
    fontSize: hp('3.5%'),
    textAlign: "center",
    color: "#006694",
    textShadowRadius: 30,
    textShadowColor: "#42FFD3",
    textAlignVertical: "top",
    fontWeight: "bold",
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
  scrollContent: {
    marginHorizontal: wp('2.8%'),
  },
});

export default RequestLoans;
