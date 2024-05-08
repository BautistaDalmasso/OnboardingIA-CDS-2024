import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./src/components/Home";
import Chat from "./src/components/Chat";
import Login from "./src/components/Login";
import Signup from "./src/components/Signup";
import { Routes } from "./src/common/enums/routes";
import ChatHeader from "./src/components/ChatHeader";
import { useContextState } from "./src/ContexState";
import Logout from "./src/components/Logout";
import Profile from "./src/components/Profile";
import LoginFingerPrint from "./src/components/LoginFingerprint";
import { ConnectionType } from "./src/common/enums/connectionType";
import RegisterFace from "./src/components/RegisterFace";
import LoginFace from "./src/components/LoginFace";
import MyLoans from "./src/components/MyLoans";
import BookList from "./src/components/BookList";
import Licence from "./src/components/Licence";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Router = () => {
  const { contextState } = useContextState();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{ headerTitle: "", headerTransparent: true }}
      >
        <Drawer.Screen name={Routes.Home} component={Home} />
        {contextState.isConnected ? (
          <>
            <Stack.Screen
              name={Routes.Chat}
              component={Chat}
              options={{
                header: (props) => <ChatHeader {...props} />,
                headerTransparent: false,
              }}
            />
            {contextState.user === null && (
              <>
                <Drawer.Screen
                  name={Routes.LoginFingerprint}
                  component={LoginFingerPrint}
                  options={{ drawerItemStyle: { display: "none" } }}
                />
                <Drawer.Screen
                  name={Routes.LoginFace}
                  component={LoginFace}
                  options={{ drawerItemStyle: { display: "none" } }}
                />
                <Drawer.Screen name={Routes.Login} component={Login} />
                <Stack.Screen name={Routes.Signup} component={Signup} />
              </>
            )}
            {contextState.user !== null && (
              <>
                {contextState.user.dni ? (
                  <>
                    <Stack.Screen name={Routes.Carnet} component={Licence} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name={Routes.Licence} component={Profile} />
                  </>
                )}
                <Stack.Screen name={Routes.BookList} component={BookList} />
                <Stack.Screen name={Routes.MyLoans} component={MyLoans} />
                <Stack.Screen
                  name={Routes.RegisterFace}
                  component={RegisterFace}
                />
                <Stack.Screen name={Routes.Logout} component={Logout} />
              </>
            )}
          </>
        ) : (
          <>
            {contextState.connectionType == ConnectionType.OFFLINE && (
              <>
                <Stack.Screen name={Routes.MyLoans} component={MyLoans} />
                <Stack.Screen name={Routes.Logout} component={Logout} />
              </>
            )}
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Router;
