import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React from "react";

const MainScreen = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  return (
    <View style={[styles.root, { width: width, height: height }]}>
      <Text style={{}}>Scren Is Rendering.</Text>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  root: { justifyContent: "center", alignItems: "center" },
});
