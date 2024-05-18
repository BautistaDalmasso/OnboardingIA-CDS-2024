import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IBookWithLicence } from "../common/interfaces/Book";
import { LicenceLevel, LicenceName } from "../common/enums/licenceLevels";

interface BookListItemProps {
  book: IBookWithLicence;
  isBookRequested: (isbn: string) => boolean;
  handleLoanRequest: (book: IBookWithLicence) => void;
}

const BookListItem = ({
  book,
  isBookRequested,
  handleLoanRequest,
}: BookListItemProps) => {
  const licenceLevelToStr = (licenceLevel: number) => {
    switch (licenceLevel) {
      case LicenceLevel.NONE:
        return LicenceName.NONE;
      case LicenceLevel.REGULAR:
        return LicenceName.REGULAR;
      case LicenceLevel.TRUSTED:
        return LicenceName.TRUSTED;
      case LicenceLevel.RESEARCHER:
        return LicenceName.RESEARCHER;
      default:
        return LicenceLevel.REGULAR;
    }
  };

  return (
    <>
      <Text style={styles.bookTitle}>{book.book_data.title}</Text>
      <Text style={styles.cardLevel}>
        Carnet: {licenceLevelToStr(book.licence_required)}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isBookRequested(book.book_data.isbn)
              ? "#ccc"
              : "#007bff",
          },
        ]}
        onPress={() => handleLoanRequest(book)}
        disabled={isBookRequested(book.book_data.isbn)}
      >
        <Text style={styles.buttonText}>
          {isBookRequested(book.book_data.isbn) ? "Solicitado" : "Solicitar"}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default BookListItem;
