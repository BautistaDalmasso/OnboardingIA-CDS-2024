import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: Option[];
  onValueChange: (value: string) => void;
  selectedValue: string;
};

const Dropdown = ({ options, onValueChange, selectedValue }: DropdownProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleValueChange = (value: string) => {
    onValueChange(value);
    handleClose();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectedValue} onPress={handlePress}>
        <Text style={styles.selectedText}>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleValueChange(option.value)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  selectedValue: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 4,
  },
  selectedText: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
  },
  modalContainer: {
    top: 400,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 50,
    marginHorizontal: 30,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionLabel: {
    fontSize: 12,
    color: "#333",
  },
});

export default Dropdown;
