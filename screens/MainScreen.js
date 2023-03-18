import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React from "react";

const MainScreen = ({ navigation }) => {
  const [height, width] = useWindowDimensions();
  return (
    <View style={[styles.root, { height: height, width: width }]}>
      <Text>Demo Text</Text>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
