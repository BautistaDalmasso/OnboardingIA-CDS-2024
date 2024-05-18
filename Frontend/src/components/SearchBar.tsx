import React from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";

interface SearchBarComponentProps {
  search: string;
  setSearch: (search: string) => void;
  searchPicker: string;
  setSearchPicker: (criteria: string) => void;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  search,
  setSearch,
  searchPicker,
  setSearchPicker,
}) => {
  return (
    <View style={styles.view}>
      <Picker
        selectedValue={searchPicker}
        style={styles.picker}
        onValueChange={(itemValue: string) => setSearchPicker(itemValue)}
      >
        <Picker.Item label="ISBN" value="isbn" />
        <Picker.Item label="Título" value="title" />
        <Picker.Item label="Autor" value="authors" />
      </Picker>
      <SearchBar
        placeholder="Buscar libro"
        onChangeText={(value) => setSearch(value)}
        value={search}
        platform="android"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default SearchBarComponent;
