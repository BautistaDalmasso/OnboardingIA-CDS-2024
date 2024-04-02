import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Message from "./Message";
import { MessageType } from "../common/enums/messageType";
import ChatTextInput from "./ChatTextInput";
import { BotService } from "../services/botService";
import { useContextState } from "../ContexState";

const Chat = () => {
  const { contextState, setContextState } = useContextState();
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>();

  useEffect(() => {
    if (!contextState.messages?.length)
      setContextState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            text: `¡Hola${
              state.user ? ` ${state.user.firstName}` : ""
            }! ¿Con qué puedo ayudarte?`,
            type: MessageType.Bot,
          },
        ],
      }));
  }, [contextState.messages]);

  const formatAnswer = (text: string) => {
    text = text.replace(
      /{user}/g,
      contextState.user ? ` ${contextState.user.firstName}` : ""
    );

    text = text.replace(
      /{carnetInstructions}/g,
      contextState.user
        ? 'dirigirte a la sección "Mi carnet"'
        : 'iniciar sesión y dirigirte a la sección "Mi carnet"'
    );

    return text;
  };

  const sendMessage = async (inputText: string) => {
    setLoading(true);
    setContextState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        { text: inputText, type: MessageType.User },
      ],
    }));

    let answer = await BotService.fetchChatbotResponse(inputText);

    setContextState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        { text: formatAnswer(answer), type: MessageType.Bot },
      ],
    }));
    setLoading(false);
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
        {contextState.messages?.map((message, index) => (
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
