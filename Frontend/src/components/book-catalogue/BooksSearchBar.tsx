import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface SearchBarComponentProps {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  filterCategory: string;
  setFilterCategory: (criteria: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  searchValue,
  setSearchValue,
  filterCategory,
  setFilterCategory,
  onSearch,
  onClear,
}) => {
  const labelToPlaceholder = () => {
    switch (filterCategory) {
      case "isbn":
        return "Buscar por ISBN";
      case "title":
        return "Buscar por Título";
      case "author":
        return "Buscar por Autor";
      case "topic":
        return "Buscar por Tema";
      default:
        return filterCategory;
    }
  };

  return (
    <View style={styles.view}>
      <Picker
        selectedValue={filterCategory}
        style={styles.picker}
        onValueChange={(itemValue: string) => setFilterCategory(itemValue)}
      >
        <Picker.Item label="ISBN (sin guiones)" value="isbn" />
        <Picker.Item label="Título" value="title" />
        <Picker.Item
          label="Autor ([apellido(s)], [nombre(s)])"
          value="author"
        />
        <Picker.Item label="Tema" value="topic" />
      </Picker>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={labelToPlaceholder()}
          onChangeText={(value) => setSearchValue(value)}
          onClear={onClear}
          value={searchValue}
          platform="android"
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => onSearch()}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginVertical: hp('1%'),
    marginHorizontal:  wp('2.8%'),
  },
  picker: {
   height: hp('7%'),
    width: wp('94%'),
    backgroundColor: "#F3FFFF"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp('0.5%'),
  },
  searchBarContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: hp('6%'),
  },
  searchBarInputContainer: {
    height: hp('3.5%'),
  },
  searchButton: {
    backgroundColor:"#006694",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: wp('2%'),
    height: hp('6%'),
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SearchBarComponent;
