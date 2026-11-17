import React, {useEffect, useState} from 'react';
const axios = require('axios');
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  StatusBar,
  ScrollView,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// galio component
import {Block, Button, Input, NavBar, Text, theme} from 'galio-framework';
import {
  STORAGE_KEY,
  URL,
  clearLocalStorage,
  STORAGE_INTRO,
} from '../utils/factory';

import MixPaymentDetail from './components/Payment/MixPaymentDetail';
import AntDesign from 'react-native-vector-icons/AntDesign';

// const DismissKeyboard = ({children}) => (
//   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//     {children}
//   </TouchableWithoutFeedback>
// );
const {height, width} = Dimensions.get('window');

const GenerateReceipt = ({navigation, route, style}) => {
  return (
    // <DismissKeyboard>
      <Block flex middle style={styles.container}>
        <Block flex middle>
          <Block style={styles.registerContainer}>
            <Block flex space="evenly">
              <Block flex={0.4} middle style={styles.socialConnect}>
                <Block flex={1} middle>
                  <AntDesign
                    size={12}
                    style={styles.AntDesignIcon}
                    color={theme.COLORS.ICON}
                    name="checkcircle"
                    family="NowExtra"
                  />
                </Block>

                <Block row middle space="between" style={{marginBottom: 0}}>
                  <Text
                    style={{
                      fontFamily: 'montserrat-regular',
                      textAlign: 'center',
                    }}
                    muted
                    size={16}>
                    Payment Successful for
                  </Text>
                </Block>
                <Block row middle space="between" style={{marginBottom: 30}}>
                  <Text
                    style={{
                      fontFamily: 'montserrat-regular',
                      textAlign: 'center',
                    }}
                    muted
                    size={16}>
                    Job ID : 252623
                  </Text>
                </Block>
              </Block>

              <Block flex={1} middle space="between">
                <Block center flex={0.9}>
                  <Block flex space="between">
                    <Block>
                      <Block width={width * 0.8} style={{marginBottom: 5}}>
                        <Text
                          style={{
                            fontFamily: 'montserrat-regular',
                            textAlign: 'left',
                          }}
                          muted
                          size={16}>
                          Enter name on Cash Receipt
                        </Text>
                      </Block>
                      <Block width={width * 0.8} style={{marginBottom: 5}}>
                        <Input placeholder="Last Name" style={styles.inputs} />
                      </Block>
                      <Block width={width * 0.8}>
                        <Text
                          style={{
                            fontFamily: 'montserrat-regular',
                            textAlign: 'left',
                          }}
                          muted
                          size={16}>
                          Email
                        </Text>
                      </Block>
                      <Block width={width * 0.8}>
                        <Input placeholder="Email" style={styles.inputs} />
                      </Block>
                    </Block>
                    <Block center>
                      <Button round style={styles.createButton}>
                        <Text
                          style={{fontFamily: 'montserrat-bold'}}
                          size={14}
                          color="#fff">
                          Generate Receipt
                        </Text>
                      </Button>
                      <Button round style={styles.createButton}>
                        <Text
                          style={{fontFamily: 'montserrat-bold'}}
                          size={14}
                          color="#fff">
                          Generate Invoice
                        </Text>
                      </Button>
                      <Button round style={styles.createButtonHome}>
                        <Text
                          style={{fontFamily: 'montserrat-bold'}}
                          size={14}
                          color="#fff">
                          Back To Home
                        </Text>
                      </Button>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    // </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: '#fff',
    width: width,
    height: height,
  },
  registerContainer: {
    //marginTop: 55,
    width: width * 0.9,
    height: height < 812 ? height * 0.8 : height * 0.8,
    overflow: 'hidden',
  },
  AntDesignIcon: {
    color: '#5fd27f',
    fontSize: 60,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 0,
    marginBottom: 10,
    backgroundColor: '#246afd',
    color: '#fff',
  },
  createButtonHome: {
    width: width * 0.5,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#5fd27f',
    color: '#fff',
  },
});

export default GenerateReceipt;
