import React, { useEffect } from "react";
import axios from 'axios';
import { Dimensions, StyleSheet, ScrollView } from "react-native";
// galio component
import { Block, Button, Input, NavBar, Text, theme } from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_SUM } from "../utils/factory";
const { height, width } = Dimensions.get("window");

const FailedScreen = ({ navigation, route, style }) => {
  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_SUM);
        if (value !== null) {
          // We have data!!
          console.log(value);
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    retrieveData();
  });

  const handleStartFinishJob = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      DriverId: driverid,
      JobId: jobid,
      Amount: 100,
      Flag: 1,
      Othercash: 100,
      PaymentMode: "Invoice",
    };
    try {
      // setshowSpinner(true);
      axios
        .post(URLDRIVER + "UpdatePaymentInvoice", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log("API error", error);
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
        contentContainerStyle={styles.articles}
      >
        <Block style={styles.SectionOne}>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.Text}
              color={theme.COLORS.SECONDARY}
            >
              Icon
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.Text1}
              color={theme.COLORS.SECONDARY}
            >
                Payment for 
              <Text style={styles.Text2}> Job No. 287008</Text>
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.Text1}
              color={theme.COLORS.SECONDARY}
            >
              Payment Failed
            </Text>
          </Block>

        </Block>
        <Block middle style={styles.JobButton}>
          <Button
            textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
            small
            center
            color="success"
            style={styles.optionsButtonStart}
            onPress={handleStartFinishJob}
          >
            Go To DashBoard
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
    height: height,
  },
  Text: {
    color: "#000",
    marginTop: 25,
    textAlign: "center",
    paddingLeft: 7,
    paddingRight: 7,
    fontSize: 20,
    fontWeight: "bold",
  },
  Text1: {
    color: "#000",
    textAlign: "center",
    paddingLeft: 7,
    paddingRight: 7,
  },
  Text2: {
    color: "#000",
    marginTop: 15,
    textAlign: "center",
    paddingLeft: 7,
    paddingRight: 7,
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
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  SectionOne: {
    //backgroundColor: '#f1f1f1',
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
    width: width,
    bottom: 0,
    textAlign: "center",
  },
  optionsButtonStart: {
    backgroundColor: "#5fd27f",
    borderRadius: 10,
  },
  optionsButtonFinish: {
    backgroundColor: "#246afd",
    borderRadius: 10,
  },
});

export default FailedScreen;
