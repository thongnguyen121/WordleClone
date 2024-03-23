import {StyleSheet, Text, View, SafeAreaView, Alert} from 'react-native';
import React from 'react';
import { colors } from './src/constant';
import Game from './src/component/Game/Game';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WORDLE</Text>
      <Game/>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: colors.lightgrey,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
});
