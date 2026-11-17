import React, { useEffect, useState } from "react";

import axios from 'axios';

import { Dimensions, StyleSheet, ScrollView } from "react-native";


import { Block, Button, Input, NavBar, Text, theme } from "galio-framework";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  STORAGE_SUM,
  STORAGE_JOBID,
  STORAGE_DRIVERID,
  URLDRIVER,
} from "../../utils/factory";
import OverlaySpinner from "../../utils/Spinner";
import AntDesign from "react-native-vector-icons/AntDesign";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const InvoicePage = ({ navigation, route, style }) => {
  const [total, setTotal] = useState();
  const [JobIds, setJobIds] = useState();
  const [showSpinner, setshowSpinner] = useState(false);


  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_SUM);
        if (value !== null) {
          // We have data!!
          setTotal(JSON.parse(value));
        }
      } catch (error) {
        alert("please try again catch1");
      }
    };
    retrieveData();
  }, []);

  useEffect(() => {
    const handleJobData = async () => {
      try {
        const values = await AsyncStorage.getItem(STORAGE_JOBID);
        if (values !== null) {
          // We have data!!
          setJobIds(JSON.parse(values));
        }
      } catch (error) {
        alert("please try again catch2");
      }
    };
    handleJobData();
  }, []);

  const handleStartFinishJob = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
      Amount: parseFloat(total),
      Flag: 1,
      Othercash: parseFloat(total && total),
      PaymentMode: "Invoice",
    };
    try {
      setshowSpinner(true);
      axios
        .post(URLDRIVER + "UpdatePaymentInvoice", json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setshowSpinner(false);
          
          console.log("respppppppppp",response);
          if (response.data.ret == 1) {
            const customerRefNumber = route?.params?.paramKey;
            navigation.navigate("AddCustomerImage");
             // navigation.navigate("SendCashConfirmation");
          }
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(false);

        })
        .finally(function () {
          // always executedr
          setshowSpinner(false);

          //handleClear();
        });
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
    }
  };
  return (
    <SafeAreaWrapper>
    <Block>
      <Block row style={styles.Headers}>
              <Block flex row>
                <Text
                 style={styles.BackText}
                  color={theme.COLORS.SECONDARY}
                  onPress={() => navigation.goBack()}
                >
                  <AntDesign name="arrowleft" style={styles.BackIcon} />
                </Text>
                <Text
                  style={styles.Joblisttitle}
                  color="#fff"
                >
                 Invoice
                </Text>
              </Block>
            </Block>

            <Block style={styles.container}>
      {showSpinner && <OverlaySpinner />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block style={styles.SectionOne}>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Text}
              color={theme.COLORS.SECONDARY}
            >
              Are you sure?
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Text1}
              color={theme.COLORS.SECONDARY}
            >
              You want to generate credit invoice for{" "}
              <Text style={styles.Text2}>Job No. {JobIds}</Text> and the amount
              below:
            </Text>
          </Block>

          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.Amount}
              color={theme.COLORS.SECONDARY}
            >
              $ {total}
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
            Generate Invoice
          </Button>
        </Block>
      </ScrollView>
    </Block>
    </Block>
    </SafeAreaWrapper>
    
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
    height: height,
  },
  Headers: {
    backgroundColor: "#3498DB",
    padding: 15,
  },
  BackText: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
  BackIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  Joblisttitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
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
    paddingBottom: 20,
    marginTop: 15,
    textAlign: "center",
    paddingLeft: 7,
    paddingRight: 7,
  },
  Text2: {
    color: "#000",
    paddingBottom: 20,
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

export default InvoicePage;
