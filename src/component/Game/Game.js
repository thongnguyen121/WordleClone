import {
    Text,
    View,
    Alert,
    ActivityIndicator,
  } from 'react-native';
  import React, {useState, useEffect} from 'react';
  import Keyboard from '../Keyboard';
  import {CLEAR, ENTER, colorToShare, colors} from '../../constant';
  import Clipboard from '@react-native-clipboard/clipboard';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Words } from '../../Words';
  import {styles} from './GameStyle';
  import ResultScreen from './EndScreen/ResultScreen';
  import Animated, {SlideInLeft, ZoomIn, FlipInEasyY} from 'react-native-reanimated';
  
  const NUMBER_OF_TRIES = 6;
  const copyArr = arr => {
    return [...arr.map(rows => [...rows])];
  };
  const Game = () => {
    const [randomNumber, setRandomNumber] = useState(0);
    const word = Words[randomNumber];
    console.log(word);
    // const words = ['hello', 'hella','hells']
    const letters = word.split('');
    const [rows, setRow] = useState(
      new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')),
    );
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setgameState] = useState('playing');
    const [loaded, setloaded] = useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const dayKey = `day-${currentDate}`
    // AsyncStorage.removeItem('gameData')
    const saveGameState = async () => {
      const data = {
        rows,
        curCol,
        curRow,
        gameState,
        word
      };
      console.log("asd" +dayKey);
      try {
        let exitedData = await AsyncStorage.getItem('gameData')
        let dataToday = exitedData ? JSON.parse(exitedData) : {}
        dataToday[dayKey] = data
        const dataString = JSON.stringify(dataToday);
        console.log('saving ' +dataString);
        await AsyncStorage.setItem('gameData', dataString);
      } catch (error) {
        console.log(error);
      }
      
    };
    const readGameState = async () => {
      const dataString = await AsyncStorage.getItem('gameData');
      console.log(dataString);
      try {
        const data = JSON.parse(dataString);
        const day = data[dayKey]
        setRow(day.rows);
        setCurCol(day.curCol);
        setCurRow(day.curRow);
        setgameState(day.gameState);
      } catch (error) {
        console.log('error ' + error);
      }
      setloaded(true);
    };
    useEffect(() => {
      if (loaded) {
        saveGameState();
      }
    }, [rows, curCol, curRow, gameState]);
    useEffect(() => {
      readGameState();
    }, []);
    useEffect(() => {
      checkAndGenerateRandomNumber();
    }, []);
  
    const checkAndGenerateRandomNumber = async () => {
      const len = Words.length;
      
      const storedDate = await AsyncStorage.getItem('lastGeneratedDate');
      if (!storedDate || storedDate !== currentDate) {
        const newRandomNumber = Math.floor(Math.random() * 100000) % len;
        await AsyncStorage.setItem('lastGeneratedDate', currentDate);
        await AsyncStorage.setItem(
          'lastGeneratedNumber',
          newRandomNumber.toString(),
        );
        setRandomNumber(newRandomNumber);
      } else {
        const storedRandomNumber = await AsyncStorage.getItem(
          'lastGeneratedNumber',
        );
        setRandomNumber(parseInt(storedRandomNumber, 10));
      }
    };
    useEffect(() => {
      if (curRow > 0) {
        checkGameState();
      }
    }, [curRow]);
    const checkGameState = () => {
      if (ifWon()) {
        setgameState('won');
      } else if (ifLose()) {
        setgameState('lose');
        console.log('lose');
      }
    };
    const share = () => {
      const text = rows
        .map((row, i) =>
          row.map((col, j) => colorToShare[getBackgroundColor(i, j)]).join(''),
        )
        .filter(row => row)
        .join('\n');
      Clipboard.setString(text);
      console.log(text);
      Alert.alert('thanh cong', 'da copy vao clipboard');
    };
    const ifWon = () => {
      const row = rows[curRow - 1];
      return row.every((letter, i) => letter === letters[i]);
    };
    const ifLose = () => {
      return curRow === rows.length;
    };
    const onKeyPressed = key => {
      if (gameState !== 'playing') {
        return;
      }
      const update = copyArr(rows);
      if (key === CLEAR) {
        const prevKey = curCol - 1;
        if (prevKey >= 0) {
          update[curRow][prevKey] = '';
          setRow(update);
          setCurCol(prevKey);
        }
        return;
      }
      if (key === ENTER) {
        if (curCol === rows[0].length) {
          setCurRow(curRow + 1);
          setCurCol(0);
        }
  
        return;
      }
      if (curCol < rows[0].length) {
        update[curRow][curCol] = key;
        setRow(update);
        setCurCol(curCol + 1);
      }
    };
    const isActive = (row, col) => {
      return row === curRow && col === curCol;
    };
    const getBackgroundColor = (row, col) => {
      const letter = rows[row][col];
      if (row >= curRow) {
        return colors.black;
      }
      if (letter === letters[col]) {
        return colors.primary;
      }
      if (letters.includes(letter)) {
        return colors.secondary;
      }
      return colors.grey;
    };
    const allColorKeyboard = color => {
      return rows.flatMap((row, i) =>
        row.filter((col, j) => getBackgroundColor(i, j) === color),
      );
    };
    const greenCaps = allColorKeyboard(colors.primary);
    const yellowCaps = allColorKeyboard(colors.secondary);
    const greyCaps = allColorKeyboard(colors.grey);
    const getCellStyle=(i,j)=>[
      styles.coll,
      {
        borderColor: isActive(i, j)
          ? colors.lightgrey
          : colors.darkgrey,
      },
      {
        backgroundColor: getBackgroundColor(i, j),
      },
    ]
    console.log(greenCaps);
    if (!loaded) {
      <ActivityIndicator />;
    }
    if(gameState !== 'playing'){
        return (<ResultScreen won = {gameState==='won'} />)
    }
    return (
      <>
        <View style={styles.map}>
          {rows.map((row, i) => (
            <Animated.View entering={SlideInLeft.delay(i * 70)} key={`row-${i}`} style={styles.row}>
              {row.map((letter, j) => (
                <React.Fragment key={`col-${j}-${i}`}>
                {i < curRow && (
                <Animated.View
                entering={FlipInEasyY.delay(j*200)}
                  key={`col-enterd-${i}-${j}`}
                  style={getCellStyle(i,j)}>
                  <Text style={styles.text}>{letter.toUpperCase()}</Text>
                </Animated.View>)}
                {i === curRow && letter && (
                <Animated.View
                entering={ZoomIn}
                  key={`col-entering-${i}-${j}`}
                  style={getCellStyle(i,j)}>
                  <Text style={styles.text}>{letter.toUpperCase()}</Text>
                </Animated.View>)}
                {!letter && (<View
                  key={`col-${i}-${j}`}
                  style={getCellStyle(i,j)}>
                  <Text style={styles.text}>{letter.toUpperCase()}</Text>
                </View>)}
                </React.Fragment>
              ))}
            </Animated.View>
          ))}
        </View>
        <Keyboard
          onKeyPressed={onKeyPressed}
          greenCaps={greenCaps}
          yellowCaps={yellowCaps}
          greyCaps={greyCaps}
        />
      </>
    );
  };
  export default Game;
  