import { StyleSheet } from "react-native";
import { colors } from "../../constant";
export const styles = StyleSheet.create({
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
    map: {alignSelf: 'stretch', height: 100},
    row: {alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center'},
    coll: {
      borderWidth: 1,
      borderColor: colors.grey,
      flex: 1,
      aspectRatio: 1,
      margin: 3,
      maxWidth: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.lightgrey,
    },
  });
  