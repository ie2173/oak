import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CreateStackNavigator } from "@react-navigation/native-stack";
import { MainScreen } from "../screens";

const Stack = CreateStackNavigator();

const MainStack = () => {
  <NavigationContainer>
    <Stack.Navigator screenoptions={{ headersShowh: false }}>
      <Stack.Screen name="Home" component={MainScreen} />
    </Stack.Navigator>
  </NavigationContainer>;
};

export default MainStack;
