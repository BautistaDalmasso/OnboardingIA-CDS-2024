import React, { Component } from "react";
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
import RequestLicence from "./src/components/RequestLicence";
import LoginFingerPrint from "./src/components/LoginFingerprint";
import { ConnectionType } from "./src/common/enums/connectionType";
import RegisterFace from "./src/components/RegisterFace";
import LoginFace from "./src/components/LoginFace";
import MyLoans from "./src/components/MyLoans";
import RequestLoans from "./src/components/RequestLoans";
import Licence from "./src/components/Licence";
import UserConfiguration from "./src/components/UserConfiguration";
import CaptureQR from "./src/components/CaptureQR";
import ViewQR from "./src/components/ViewQR";
import AddLibrarian from "./src/components/AddLibriarian";
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
                    <Drawer.Screen
                      name={Routes.ViewQr}
                      component={ViewQR}
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name={Routes.Licence}
                      component={RequestLicence}
                    />
                    {contextState.user.role!='basic'&&
                    <Stack.Screen name={Routes.AddLibrarian} component={AddLibrarian} />}
                  </>
                )}
                <Stack.Screen
                  name={Routes.RequestLoans}
                  component={RequestLoans}
                />
                <Stack.Screen name={Routes.MyLoans} component={MyLoans} />
                <Drawer.Screen
                  name={Routes.RegisterFace}
                  component={RegisterFace}
                  options={{ drawerItemStyle: { display: "none" } }}
                />
                <Stack.Screen
                  name={Routes.UserConfiguration}
                  component={UserConfiguration}
                />
                <Stack.Screen name={Routes.Logout} component={Logout} />
              </>
            )}
          </>
        ) : (
          <>
            {contextState.connectionType == ConnectionType.OFFLINE && (
              <>
                {contextState.user !== null && contextState.user.dni && (
                  <>
                    <Stack.Screen name={Routes.Carnet} component={Licence} />
                    <Drawer.Screen
                      name={Routes.ViewQr}
                      component={ViewQR}
                      options={{ drawerItemStyle: { display: "none" } }}
                    />
                  </>
                )}
                <Stack.Screen name={Routes.MyLoans} component={MyLoans} />
                <Stack.Screen name={Routes.Logout} component={Logout} />
              </>
            )}
          </>
        )}
        <Stack.Screen name={Routes.TempQr} component={CaptureQR} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Router;
