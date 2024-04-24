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
import Loans from "./src/components/Loans";
import Profile from "./src/components/Profile";
import LoginFingerPrint from "./src/components/LoginFingerprint";
import { ConnectionType } from "./src/common/enums/connectionType";

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
                <Drawer.Screen name={Routes.Login} component={Login} />
                <Stack.Screen name={Routes.Signup} component={Signup} />
              </>
            )}
            {contextState.user !== null && (
              <>
                <Stack.Screen name={Routes.Licence} component={Profile} />
                <Stack.Screen name={Routes.Logout} component={Logout} />
                <Stack.Screen name={Routes.Loans} component={Loans} />
              </>
            )}
          </>
        ) : (
          <>
            {contextState.connectionType == ConnectionType.OFFLINE && (
              <>
                <Stack.Screen name={Routes.Loans} component={Loans} />
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
