import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, keys} from '../../../constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {SlideInLeft} from 'react-native-reanimated';

const Number = ({number, label}) => (
  <View style={{alignItems: 'center', margin: 10}}>
    <Text style={{color: colors.lightgrey, fontSize: 40, fontWeight: 'bold'}}>
      {number}
    </Text>
    <Text style={{color: colors.lightgrey, fontSize: 20}}>{label}</Text>
  </View>
);
const GuessDistributionLine = ({position, amount, percentage}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      width: '100%',
    }}>
    <Text style={{color: colors.lightgrey}}>{position}</Text>
    <View
      style={{
        alignSelf: 'stretch',
        backgroundColor: colors.grey,
        margin: 5,
        padding: 5,
        width: `${percentage}%`,
        minWidth: 20,
      }}>
      <Text style={{color: colors.lightgrey}}>{amount}</Text>
    </View>
  </View>
);
const GuessDistribution = ({distribution}) => {
  if (!distribution) {
    return null;
  }
  const sum = distribution.reduce((total, dist) => (dist + total), 0);
  return (
    <>
      <Text style={styles.statistics}>GUESS DISTRIBUTION</Text>
      <View style={{width: '100%', padding: 20}}>
        {distribution.map((dist, index) => (
          <GuessDistributionLine
            position={index + 1}
            amount={dist}
            key={index}
            percentage={(100 * dist) / sum}
          />
        ))}
      </View>
    </>
  );
};

const ResultScreen = ({won = false}) => {
  const [secondsTillNextDay, setSecondsTillNextDay] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [distribution, setDistribution] = useState(null);
  const [wordInDay, setWordInDay] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [loaded, setloaded] = useState(false);
  const dayKey = `day-${currentDate}`;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      setSecondsTillNextDay((tomorrow - now) / 1000);
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    readGameState();
  }, []);
  const readGameState = async () => {
    const dataString = await AsyncStorage.getItem('gameData');
    let data;
    try {
      data = JSON.parse(dataString);
    } catch (error) {
      console.log('error ' + error);
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    setPlayed(keys.length);
    const numberWin = values.filter(game => game.gameState === 'won').length;
    setWinRate(Math.floor((numberWin * 100) / keys.length));

    let _curStreak = 0;
    let _maxStreak = 0;
    keys.forEach((key) => {
      if (data[key].gameState === 'won') {
         _curStreak += 1;
         
      } else {
        if (_curStreak > _maxStreak) {
          _maxStreak = _curStreak;
        }
        _curStreak = data[key].gameState === 'won' ? 1 : 0;
      }
    });
    setCurStreak(_curStreak);
    setMaxStreak(_maxStreak);
    setWordInDay(data[dayKey].word);
    
    setloaded(true);

    const dist = [0, 0, 0, 0, 0, 0];
    values.map(game => {
      if (game.gameState === 'won') {
        const tries = game.rows.filter(row => row[0]).length;
        dist[tries-1] = dist[tries-1] + 1;
      }
    });
    setDistribution(dist);
  };
  const formatSecond = () => {
    const hours = Math.floor(secondsTillNextDay / (60 * 60));
    const minutes = Math.floor((secondsTillNextDay % (60 * 60)) / 60);
    const seconds = Math.floor(secondsTillNextDay % 60);
    return `${hours}:${minutes}:${seconds}`;
  };
  // if (!loaded) {
  //   <ActivityIndicator />;
  // }
  return (
    <ScrollView>
      <Animated.View entering={SlideInLeft} style={{width: '100%', alignItems: 'center'}}>
        <Text style={styles.title}>
          {won
            ? `Congrat! Today's word is "${wordInDay}"`
            : `Try again tomorrow. Today's word is "${wordInDay}"`}
        </Text>
        <Text style={styles.statistics}>STATISTICS</Text>
        <View style={{flexDirection: 'row'}}>
          <Number number={played} label={'Played'} />
          <Number number={winRate} label={'Win %'} />
          <Number number={curStreak} label={'Cur streak'} />
          <Number number={maxStreak} label={'Max streak'} />
        </View>
        <GuessDistribution distribution={distribution} />
        <View style={{flexDirection: 'row'}}>
          <View style={{alignItems: 'center', flex: 1}}>
            <Text style={styles.text}>Next Wordle</Text>
            <Text style={styles.text}>{formatSecond()}</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginVertical: 15,
    padding: 10 
  },
  statistics: {
    fontSize: 20,
    color: colors.lightgrey,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  text: {
    color: colors.lightgrey,
    fontSize: 20,
  },
});
