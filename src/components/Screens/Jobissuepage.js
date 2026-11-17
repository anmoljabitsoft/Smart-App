import React, {useEffect, useState} from 'react';
const axios = require('axios');
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  // TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// galio component
import {Block, Button, Input, NavBar, Text, } from 'galio-framework';
import {
  STORAGE_KEY,
  URL,
  clearLocalStorage,
  STORAGE_INTRO,
} from '../utils/factory';
import Customerdetail from './components/Jobdetail/Customerdetail';
import Jobdetail from './components/Jobdetail/Jobdetail';

const {height, width} = Dimensions.get('window');

const Jobissuepage = ({navigation, route, style}) => {
  return (
    <Block style={styles.container}>
      <Block row>
        <Block flex>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            // style={{fontFamily: 'montserrat-regular'}}
            size={14}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            style={styles.cardTitle}
            // color={theme.COLORS.SECONDARY}
            >
            Add issue
          </Text>
        </Block>
      </Block>
      <Block style={styles.cardContainer}>
        <Block row>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.Lable}
              // color={theme.COLORS.SECONDARY}
              >
              Job ID
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Input placeholder="First Name" style={styles.inputs} />
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Lable}
              // color={theme.COLORS.SECONDARY}
              >
              Customer Reference No.
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Input placeholder="First Name" style={styles.inputs} />
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Lable}
              // color={theme.COLORS.SECONDARY}
              >
              Select Date
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Input placeholder="First Name" style={styles.inputs} />
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Lable}
              // color={theme.COLORS.SECONDARY}
              >
              Select Solutions
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Input placeholder="First Name" style={styles.inputs} />
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Lable}
              // color={theme.COLORS.SECONDARY}
              >
              Select issue image
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Input placeholder="First Name" style={styles.inputs} />
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Lable}
              // color={theme.COLORS.SECONDARY}
              >
              Option Manager Notes
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block flex>
            <Input placeholder="First Name" style={styles.inputs} />
          </Block>
        </Block>
      </Block>

      <Block row space="between" style={styles.JobButton}>
        <Block flex>
          <Button
            textStyle={{fontFamily: 'montserrat-regular', fontSize: 15}}
            small
            center
            color="success"
            style={styles.optionsButtonStart}>
            Clear
          </Button>
        </Block>
        <Block flex right>
          <Button
            textStyle={{fontFamily: 'montserrat-regular', fontSize: 15}}
            center
            color="info"
            style={styles.optionsButtonFinish}>
            Save
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: '#fff',
    width: width,
    height: height,
  },
  cardTitle: {
    fontSize: 15,
    color: '#000',
    marginTop: 15,
    marginBottom: 20,
  },
  JobButton: {
    position: 'absolute',
    width: width,
    bottom: 0,
  },
  optionsButtonStart: {
    backgroundColor: '#969696',
    borderRadius: 10,
  },
  optionsButtonFinish: {
    backgroundColor: '#f66263',
    borderRadius: 10,
  },
  cardContainer: {
    backgroundColor: '#dedede',
    borderWidth: 0,
    //height: height < 500 ? height * 0.5 : height * 0.5,
    textAlign: 'center',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 0,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    marginBottom: 15,
  },
  Lable: {
    color: '#000',
  },
});

export default Jobissuepage;
