import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Message from "./Message";
import { IMessage } from "../common/interfaces/Message";
import { MessageType } from "../common/enums/messageType";
import ChatTextInput from "./ChatTextInput";

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([
    { text: "¡Hola usuario! ¿Con qué puedo ayudarte?", type: MessageType.Bot },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>();

  const sendMessage = (inputText: string) => {
    setLoading(true);
    setMessages((messages) => [
      ...messages,
      { text: inputText, type: MessageType.User },
    ]);

    let answer = "ERROR AL CONECTARSE CON SKYNET."

    const answer_request = fetch("http://192.168.1.41:8080/", {
    method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ "question": inputText })
    })
    .then(response => response.json())
    .then(data => {
        answer = data.answer
    })
    .catch(error => console.error(error))

    setTimeout(() => {
      setMessages((messages) => [
        ...messages,
        { text: answer, type: MessageType.Bot },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
        {loading && (
          <Message
            message={{ text: "", type: MessageType.Bot, loading: true }}
            key={"loading"}
          />
        )}
      </ScrollView>
      <ChatTextInput onSubmit={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 90,
    paddingTop: 10,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default Chat;
