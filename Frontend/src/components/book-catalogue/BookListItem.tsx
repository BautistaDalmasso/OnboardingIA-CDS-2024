import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { IAuthor, IBookWithLicence } from "../../common/interfaces/Book";
import { licenceLevelToStr } from "../../common/enums/licenceLevels";
import LinkButton from "../common/LinkButton";

interface BookListItemProps {
  book: IBookWithLicence;
  isBookRequested: (isbn: string) => boolean;
  handleLoanRequest: (book: IBookWithLicence) => void;
  handleButtonSearch: (filterCategory: string, searchValue: string) => void;
}

const BookListItem = ({
  book,
  isBookRequested,
  handleLoanRequest,
  handleButtonSearch,
}: BookListItemProps) => {
  const [creator, setCreator] = useState<IAuthor | null>(null);
  const [otherContributors, setOtherContributors] = useState<IAuthor[]>([]);

  const findCreatorAndContributors = () => {
    const otherAuthors: IAuthor[] = [];
    let foundCreator = null;

    for (const author of book.book_data.authors) {
      if (author.role === "creator") {
        foundCreator = author;
      } else {
        otherAuthors.push(author);
      }
    }

    setCreator(foundCreator);
    setOtherContributors(otherAuthors);
  };

  useEffect(() => {
    findCreatorAndContributors();
  }, [book]);

  const contributorsSubComponent = () => {
    return (
      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Colaborador(es): </Text>
        {otherContributors.map((contributor, index) => (
          <React.Fragment key={index}>
            <LinkButton
              text={contributorText(contributor)}
              onPress={() => handleButtonSearch("author", contributor.name)}
            />
            {index < otherContributors.length - 1 && (
              <Text style={styles.separator}>|</Text>
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const contributorText = (contributor: IAuthor) => {
    if (contributor.role === null || contributor.role === "") {
      return contributor.name;
    }

    return `${contributor.name} [${contributor.role}]`;
  };

  const topicsSubComponent = () => {
    return (
      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Tema(s): </Text>
        {book.book_data.topics.map((topic, index) => (
          <React.Fragment key={index}>
            <LinkButton
              text={topic}
              onPress={() => handleButtonSearch("topic", topic)}
            />
            {index < book.book_data.topics.length - 1 && (
              <Text style={styles.separator}>|</Text>
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <>
      <Text style={styles.bookTitle}>{book.book_data.title}</Text>

      {creator && (
        <View style={styles.mixedTextContainer}>
          <Text style={styles.label}>Por: </Text>
          <LinkButton
            text={creator.name}
            onPress={() => handleButtonSearch("author", creator.name)}
          />
        </View>
      )}

      {otherContributors.length > 0 && contributorsSubComponent()}

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Editor:</Text>
        <Text style={styles.publisher}> {book.book_data.place} : </Text>
        <LinkButton
          text={book.book_data.publisher}
          onPress={() =>
            handleButtonSearch("publisher", book.book_data.publisher)
          }
        />
        <Text style={styles.publisher}>, {book.book_data.date_issued}</Text>
      </View>

      {book.book_data.edition && (
        <View style={styles.mixedTextContainer}>
          <Text style={styles.label}>Edición:</Text>
          <Text style={styles.edition}> {book.book_data.edition} </Text>
        </View>
      )}

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.description}> {book.book_data.description} </Text>
      </View>

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>ISBN:</Text>
        <Text style={styles.isbn}> {book.book_data.isbn} </Text>
      </View>

      {topicsSubComponent()}

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Clasificación CDD:</Text>
        <Text style={styles.ddcClass}> {book.book_data.ddc_class} </Text>
        <LinkButton
          text="(?)"
          onPress={() =>
            Alert.alert(
              "Clasificación Decimal de Dewey",
              "Las Secciones y Estanterías de nuestra biblioteca están ordenadas según este código." +
                " Podés utilizarlo para localizar el libro que buscás.",
            )
          }
        />
      </View>

      {book.book_data.abstract && (
        <View style={styles.mixedTextContainer}>
          <Text style={styles.label}>Resumen:</Text>
          <Text style={styles.abstract}> {book.book_data.abstract} </Text>
        </View>
      )}

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Nivel de Carnet Requerido:</Text>
        <Text style={styles.licenceLevel}>
          {" "}
          {licenceLevelToStr(book.licence_required)}{" "}
        </Text>
      </View>

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Disponibles:</Text>
        <Text style={styles.availability}> {book.availability.available} </Text>
      </View>

      <View style={styles.mixedTextContainer}>
        <Text style={styles.label}>Prestados:</Text>
        <Text style={styles.availability}> {book.availability.borrowed} </Text>
      </View>

      {book.availability.available > 0 ? (
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
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ccc" }]}
          disabled={true}
        >
          <Text style={styles.buttonText}>{"Fuera de stock"}</Text>
        </TouchableOpacity>
      )}
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
  licenceLevel: {
    fontSize: 16,
    marginTop: 10,
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
  mixedTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  publisher: {
    fontSize: 16,
    marginTop: 10,
  },
  edition: {
    fontSize: 16,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  isbn: {
    fontSize: 16,
    marginTop: 10,
  },
  topics: {
    fontSize: 16,
    marginTop: 10,
  },
  ddcClass: {
    fontSize: 16,
    marginTop: 10,
  },
  abstract: {
    fontSize: 16,
    marginTop: 10,
  },
  separator: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  availability: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default BookListItem;
