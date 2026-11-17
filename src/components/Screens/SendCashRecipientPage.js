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
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// galio component
import {Block, Button, Input, Text, } from 'galio-framework';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {STORAGE_DRIVERID, STORAGE_JOBID, URL} from '../utils/factory';

const {height, width} = Dimensions.get('window');

const SendCashRecipientPage = ({navigation, route, style}) => {
  const [quote, setQuote] = React.useState({
    name: '',
    email: '',
  });
  const [userName, setUserName] = useState('');
  const [UserEmail, setUserEmail] = useState('');

  const handleUserDetails = (e, type) => {
    const value = e.nativeEvent.text;
    const data = {
      name: quote.name.toString(),
      email: quote.email.toString(),
    };
    if (type == 1) {
      data.name = value;
    } else if (type == 2) {
      data.email = value;
    }
    setQuote(data);
  };

  console.log(
    `user name is here: ${userName} and user email id is herer ${UserEmail}`,
  );

  useEffect(() => {
    setUserName(quote.name);
    setUserEmail(quote.email);
  }, [quote]);

  const handleRedirect = () => {
    // navigation.navigate('Dash');
    // navigation.navigate('Profilepage');
  };

  const handleSentNameAndEmail = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    const json = {
      DriverId: driverid,
      JobId: jobid,
      userName: userName,
      UserEmail: UserEmail,
    };
    try {
      axios
        .post(URL + 'sendcashrecipt', json, {
          headers: {
            Authorization:
              'YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm',
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (response.data.length > 0) {
            handleRedirect();
            // console.log('response:::::::::::::::::::::', response);
          }
        })
        .catch(error => {
          console.log('API error', error);
        })
        .finally(function () {
          // always executedr
          //handleClear();
        });
    } catch (error) {
      console.log(error);
      //  setshowSpinner(false);
    }
  };

  return (
    <Block style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
         <Block style={styles.topblock}>
          <Block center>
            <Text
              // style={{fontFamily: 'montserrat-regular'}}
              size={16}
              style={styles.SecondTextBox}
              // color={theme.COLORS.SECONDARY}
            >
              Want to send cash receipt for
            </Text>
            <Text
              // style={{fontFamily: 'montserrat-regular'}}
              size={16}
              style={styles.FirstTextBox}
              // color={theme.COLORS.SECONDARY}
            >
              Job ID: 202020
            </Text>
          </Block>
        </Block>
        <Block>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.Text}
              // color={theme.COLORS.SECONDARY}
            >
              Enter Name
            </Text>
          </Block>

          <Block>
            <Block flex right style={styles.wi50}>
              <Input
                style={styles.ListTitleRight}
                placeholder="Enter Your Name"
                placeholderTextColor={"#8898AA"}
                name="name"
                onChange={(e) => handleUserDetails(e, 1)}
                shadowless
                iconContent={
                  <FontAwesome
                    size={12}
                    style={styles.FontAwesome}
                    // color={theme.COLORS.ICON}
                    name="user"
                    family="NowExtra"
                  />
                }
              />
            </Block>
          </Block>
        </Block>
        <Block style={styles.emailblock}>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.Text}
              // color={theme.COLORS.SECONDARY}
            >
              Email
            </Text>
          </Block>

          <Block>
            <Input
              style={styles.ListTitleRight}
              placeholder="Enter Your Email Id"
              placeholderTextColor={"#8898AA"}
              onChange={(e) => handleUserDetails(e, 2)}
              name="email"
              shadowless
              iconContent={
                <FontAwesome
                  size={12}
                  style={styles.FontAwesome}
                  // color={theme.COLORS.ICON}
                  name="envelope"
                  family="NowExtra"
                />
              }
            />
          </Block>
        </Block>
      </ScrollView>
      <Block middle style={styles.JobButton}>
        <Button
          textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
          small
          center
          color="success"
          style={styles.optionsButtonStart}
          onPress={handleSentNameAndEmail}
        >
          send cash receipt
        </Button>
      </Block>
      <Block style={styles.Skip}>
        <Block center>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ fontFamily: "montserrat-regular" }}
            size={16}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            // style={styles.Text}
            // color={theme.COLORS.SECONDARY}
          >
            Skip
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
    height: height,
    paddingTop: 50,
  },
  topblock: {
    marginBottom: 20,
  },
  Text: {
    color: "#515151",
    paddingBottom: 10,
    marginBottom: -13,
    fontSize: 14,
    fontWeight: "bold",
  },
  TextTwo: {
    color: "#000",
    paddingBottom: 10,
  },
  Amount: {
    padding: 10,
    borderColor: "#f1f1f1",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  SectionOne: {
    backgroundColor: "#f1f1f1",
    marginBottom: 15,
    marginTop: 15,
  },
  cardTitle: {
    fontSize: 15,
    color: "#000",
    marginTop: 0,
  },
  log: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 70,
    textTransform: "capitalize",
    height: 30,
  },
  JobButton: {
    position: "absolute",
    width: width,
    bottom: 0,
    textAlign: "center",
    paddingBottom: 210,
    marginTop: 500,
  },
  optionsButtonStart: {
    backgroundColor: "#5fd27f",
    borderRadius: 10,
  },
  optionsButtonFinish: {
    backgroundColor: "#246afd",
    borderRadius: 10,
  },
  Skip: {
    //backgroundColor: '#f1f1f1',
    marginBottom: 120,
    marginTop: 50,
  },
  ListTitleRight: {
    paddingRight: 120,
  },
  FontAwesome: {
    marginRight: 10,
  },
  FirstTextBox: {
    fontFamily: "montserrat-regular",
    fontWeight: "bold",
    color: "#3E3E3E",
  },
  SecondTextBox: {},
  emailblock: {
    marginTop: 15,
    marginBottom: 15,
  },
});

export default SendCashRecipientPage;
