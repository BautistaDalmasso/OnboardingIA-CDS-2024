import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/components/Login";
import Chat from "./src/components/Chat";
import Profile from "./src/components/Profile";
import Form from "./src/components/Form";

import { Routes } from "./src/common/enums/routes";
import ChatHeader from "./src/components/ChatHeader";

import {
  createDrawerNavigator,
 
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const App = () => {
  return (
    <>
    <NavigationContainer >
    <Drawer.Navigator  >
    <Drawer.Screen name={Routes.Home} component={Login}  />
  
       <Drawer.Screen name={Routes.Profile} component={Profile} />
       <Stack.Screen 
          name={Routes.Chat}
          component={Chat}
          options={{ header: (props) => <ChatHeader {...props} /> }}
        />
         <Stack.Screen 
          name={Routes.SignIn}
          component={Form}
          
        />
       </Drawer.Navigator>
    </NavigationContainer>
    
    </>
  );
};
 
export default App;
