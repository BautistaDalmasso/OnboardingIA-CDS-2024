import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./src/components/Home";
import Chat from "./src/components/help-chat/Chat";
import Login from "./src/components/auth/Login";
import Signup from "./src/components/auth/Signup";
import { Routes } from "./src/common/enums/routes";
import ChatHeader from "./src/components/help-chat/ChatHeader";
import { useContextState } from "./src/ContexState";
import Logout from "./src/components/auth/Logout";
import RequestLicence from "./src/components/user/RequestLicence";
import LoginFingerPrint from "./src/components/auth/LoginFingerprint";
import { ConnectionType } from "./src/common/enums/connectionType";
import RegisterFace from "./src/components/auth/RegisterFace";
import LoginFace from "./src/components/auth/LoginFace";
import MyLoans from "./src/components/user/MyLoans";
import RequestLoans from "./src/components/book-catalogue/BrowseCatalogue";
import LibrarianLoans from "./src/components/librarian/LibrarianLoans";
import Licence from "./src/components/user/Licence";
import UserConfiguration from "./src/components/user/UserConfiguration";

import ViewQR from "./src/components/user/ViewQR";
import CreateDeleteLibrarian from "./src/components/librarian/CreateDeleteLibrarian";
import RUDUser from "./src/components/librarian/RUDUser";
import PointsExchange from "./src/components/points/PointsExchange";
import ManagementLoan from "./src/components/librarian/ManagementLoan";
import { Button } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import LoanCreation from "./src/components/librarian/LoanCreation";

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

                    <Stack.Screen name={Routes.MyLoans} component={MyLoans} />

                    <Stack.Screen
                      name={Routes.PointsExchange}
                      component={PointsExchange}
                    />
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name={Routes.Licence}
                      component={RequestLicence}
                    />
                  </>
                )}
                <Stack.Screen
                  name={Routes.RequestLoans}
                  component={RequestLoans}
                />

                {/* Librarian components */}
                {contextState.user.role === "librarian" && (
                  <>
                    <Stack.Screen
                      name={Routes.LibrarianLoans}
                      component={LibrarianLoans}
                    />
                    <Stack.Screen name={Routes.RUDUser} component={RUDUser} />
                    <Stack.Screen
                      name={Routes.CreateDeleteLibrarian}
                      component={CreateDeleteLibrarian}
                    />
                     <Stack.Screen
                      name={Routes.LoanCreation}
                      component={LoanCreation}
                    />
                    <Drawer.Screen
                    name={Routes.ManagementLoan}
                    component={ManagementLoan}
                    options={({ navigation }) => ({
                        headerLeft: () => (
                          <Icon.Button
                              name="arrow-back"
                              size={25}
                              backgroundColor="transparent"
                              color="#000"
                              onPress={() => navigation.navigate("Prestamos")}
                          />
                         ),
                        drawerItemStyle: { display: 'none' }
                    })}
                     />
                  </>
                )}

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
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Router;
