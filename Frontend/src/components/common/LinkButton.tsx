import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface LinkButtonProps {
  text: string;
  onPress: () => void;
}

const LinkButton = ({ text, onPress }: LinkButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.linkContainer}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    marginRight: 5,
  },
  linkText: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default LinkButton;
