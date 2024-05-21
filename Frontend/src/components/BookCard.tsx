import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface BookCardProps {
  title: string;
  dueDate: Date;
  status: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, dueDate, status }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>
          Vencimiento: {new Date(dueDate).toLocaleDateString()}
        </Text>
        <Text style={styles.detail}>Estado: {status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    width: 350,
    height: 170,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    padding: 16,
    marginVertical: 8,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    marginStart: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#006691",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  detail: {
    fontSize: 17,
    color: "#006695",
  },
});

export default BookCard;
