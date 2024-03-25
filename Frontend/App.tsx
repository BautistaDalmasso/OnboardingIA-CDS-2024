import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/components/Login";
import Chat from "./src/components/Chat";
import { Routes } from "./src/common/enums/routes";
import ChatHeader from "./src/components/ChatHeader";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Routes.Home}>
        <Stack.Screen
          name={Routes.Home}
          component={Login}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={Routes.Chat}
          component={Chat}
          options={{ header: (props) => <ChatHeader {...props} /> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
