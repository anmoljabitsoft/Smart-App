import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Block, theme} from 'galio-framework';
import {
  STORAGE_KEY,
  STORAGE_INTRO,
  STORAGE_DRIVERID,
} from '../utils/factory';

const {height, width} = Dimensions.get('window');

const Main = ({navigation, route}) => {

  useEffect(() => {
    readData();
  }, []);

  const readData = async () => {
    const userid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const introflag = await AsyncStorage.getItem(STORAGE_INTRO);
    if (userid === null || userid === undefined) {
      navigation.navigate('Login');
    } else {
      if (introflag === null || introflag === undefined) {
        //       navigation.navigate('Intro');
        navigation.navigate('Jobs');
      } else {
        navigation.navigate('Dash');
      }
    }
    // console.log('data from storage::::', userid);
  };
  const clearData = async () => {
    AsyncStorage.clear();
    const userid = await AsyncStorage.getItem(STORAGE_KEY);
    // console.log('data from storage::::', userid);
  };

  return (
    <Block flex style={{backgroundColor: theme.COLORS.WHITE}}>
      <Block center>
        <Image
          center
          style={{
            marginTop: (theme.SIZES.BASE * 30) / 2,
            backgroundColor: '#0d92f3',
            // borderRadius: 100,
            width: width - theme.SIZES.BASE * 8,
            height: 50,
          }}
          source={require('../images/logo.jpg')}
        />
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
});

export default Main;
