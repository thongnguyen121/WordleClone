import {StyleSheet, Text, View, Pressable, Dimensions} from 'react-native';
import React from 'react';
import {keys, colors, ENTER, CLEAR} from '../constant';
import Animated, {SlideInDown} from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;
export const keyWidth = (screenWidth - 10) / keys[0].length;
const keyHeight = keyWidth * 1.3;
const Keyboard = ({
  onKeyPressed = () => {},
  greenCaps = [],
  yellowCaps = [],
  greyCaps = [],
}) => {
  const isLongButton = key => {
    return key == ENTER || key == CLEAR;
  };
  const getKeyBGColor = key => {
    if (greenCaps.includes(key)) {
      return colors.primary;
    }
    if (yellowCaps.includes(key)) {
      return colors.secondary;
    }
    if (greyCaps.includes(key)) {
      return colors.darkgrey;
    }
    return colors.grey;
  };
  return (
    <Animated.View entering={SlideInDown.duration(1000).springify().mass(0.4)} style={styles.keyboard}>
      {keys.map((keyrow, i) => (
        <View style={styles.row} key={`row-${i}`}>
          {keyrow.map((key) => (
            <Pressable
              onPress={()=>onKeyPressed(key)}
              key={key}
              disabled={greyCaps.includes(key)}
              style={[
                styles.key,
                isLongButton(key) ? {width: keyWidth * 1.4} : {},
                {backgroundColor: getKeyBGColor(key)},
              ]}>
              <Text style={styles.keyText}>{key}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

export default Keyboard;

const styles = StyleSheet.create({
  keyboard: {
    alignSelf: 'stretch',
    marginTop: 'auto',
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  key: {
    width: keyWidth - 4,
    height: keyHeight - 4,
    margin: 2,
    borderRadius: 5,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
  },
});
