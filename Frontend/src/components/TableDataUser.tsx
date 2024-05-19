import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  licence: string;
};

const App: React.FC<Props> = ({ name, lastName, email, dni , licence }) => {
  const tableHead = ['Datos del usuario'];
  const tableData = [
    ['  Nombre ', name],
    ['  Apellido ', lastName],
    ['  email      ', email],
    ['  DNI         ', dni],
    ['  carnet    ', licence],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.textHead}>{tableHead[0]}</Text>
      </View>
      {tableData.map((row, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.text}>{row[0]}</Text>
          <Text style={styles.text}>{row[1]+"   "}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    justifyContent: 'center',

  },
  head: {
    height: 40,
    backgroundColor: '#48bce4',
  },
  textHead: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    height: 40,
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
     borderWidth:2,
     borderColor:'white',
  },
  text: {
    margin: 6,
    borderRightWidth:4,
     borderRightColor:'white',
     fontSize: 10,
  },
});

export default App;
