  //* TypeError: Cannot read property 'map' of undefined This error is located at:
  //  in SearchBarComponent2 (created by LibrarianLoans2)

import React from "react";
import { View, StyleSheet } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";

//interface PickerItem {
//    label: string;
//    value: string;
//  }
interface SearchBarComponentProps {
    pickerItems: { label: string; value: string }[];
  //pickerItems: PickerItem[];
  search: string;
  setSearch: (search: string) => void;
  searchPicker: string;
  setSearchPicker: (criteria: string) => void;

}

const SearchBarComponent2: React.FC<SearchBarComponentProps> = ({
    pickerItems,
 // pickerItems = [],
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
        {pickerItems.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
      <SearchBar
        placeholder="Buscar Prestamo"
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
    backgroundColor:"#EAEAEA",
    height: 50,
    width: "100%",
  },
});

export default SearchBarComponent2;
