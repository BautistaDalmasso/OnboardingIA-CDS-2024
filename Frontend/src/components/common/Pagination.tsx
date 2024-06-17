import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface PaginationProps {
  currentPage: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  lastPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  goToPreviousPage,
  goToNextPage,
  lastPage,
}) => {
  console.log(currentPage)
  return (
    <View style={styles.pageContainer}>
      <TouchableOpacity
        style={styles.pageButton}
        onPress={goToPreviousPage}
        disabled={currentPage === 0}
      >
        <Text style={styles.pageButtonText}>
          {"<<"} Pág {currentPage}{" "}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.pageButton}
        onPress={goToNextPage}
        disabled={lastPage === currentPage}
      >
        <Text style={styles.pageButtonText}>
          Pág {currentPage + 1} {">>"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginVertical: "auto",
  },
  pageButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    position: "static",
    marginVertical: "auto",
  },
  pageButtonText: {
    color: "#000",
  },
});

export default Pagination;
