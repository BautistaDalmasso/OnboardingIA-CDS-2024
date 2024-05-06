import * as React from "react";
import { Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface Props {
  title?: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  colorIcon?: string;
  height?: number;
  width?: number;
  disabled?: boolean;
}

export default function Button({ title, onPress, disabled, icon, colorIcon, color, height = 40, width = 300 }: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, { backgroundColor: color || "black", height, width }]}>
      <Entypo style={styles.icono}
              name={icon as any}
              size={28}
              color={colorIcon ? colorIcon : "white"} />
      <Text style={styles.text}>{title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icono: {
    marginStart: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 30,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#f1f1f1",
    marginLeft: 9,
  },
});
