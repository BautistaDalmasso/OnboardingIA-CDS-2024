import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Keyboard,
  TouchableOpacity,
} from "react-native";

interface Props {
  onSubmit: (text: string) => void;
}

const ChatTextInput = ({ onSubmit }: Props) => {
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim().length) {
      onSubmit(inputText);
      setInputText("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Escribe tu mensaje aquí..."
        onSubmitEditing={sendMessage}
      />
      <TouchableOpacity
        onPress={sendMessage}
        style={styles.sendButtonContainer}
      >
        <Image
          source={require("../assets/send-message-button.png")}
          style={styles.sendButton}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 50,
  },
  sendButtonContainer: {
    position: "absolute",
    right: 40,
  },
  sendButton: {
    width: 18,
  },
});

export default ChatTextInput;
