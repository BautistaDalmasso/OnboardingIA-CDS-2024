import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";

interface SearchBarComponentProps {
  pickerItems: { label: string; value: string }[];
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  filterCategory: string;
  setFilterCategory: (criteria: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  pickerItems,
  searchValue,
  setSearchValue,
  filterCategory,
  setFilterCategory,
  onSearch,
  onClear,
}) => {
  const labelToPlaceholder = (
    filterCategory: string,
    pickerItems: { label: string; value: string }[],
  ) => {
    const item = pickerItems.find((item) => item.value === filterCategory);
    if (item) {
      return ` ${item.label}`;
    } else {
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
        {pickerItems.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={labelToPlaceholder(filterCategory, pickerItems)}
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
    margin: 10,
  },
  picker: {
    backgroundColor: "#EAEAEA",
    height: 50,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchBarContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 50,
    minHeight: 50,
  },
  searchBarInputContainer: {
    height: "100%",
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchBarComponent;
