import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entypo } from "@expo/vector-icons";

interface BookCardProps {
  title: string;
  dueDate: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, dueDate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <Entypo name ="book" color="#006691" size={32} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Vencimiento: {dueDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    width:330,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
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
    flexDirection: 'row',
    marginBottom: 8,

  },
  title: {
    marginStart:10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#006691',
  },
  detailsContainer: {
    flex:1,
   justifyContent:'flex-end',
    alignItems: 'flex-end',

  },
  detail: {
    fontSize: 17,
    color: '#006695',
  },
});

export default BookCard;
