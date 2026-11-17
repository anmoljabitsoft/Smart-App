import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text, theme } from "galio-framework";
import {
  STORAGE_DRIVERID,
  URLDRIVER,
  STORAGE_JOBID,
  STORAGE_SUM,
} from "../../utils/factory";
import AntDesign from "react-native-vector-icons/AntDesign";
import { OverlaySpinner } from "../../utils/Spinner";
import SafeAreaWrapper from "../SafeAreaWrapper";
const { height, width } = Dimensions.get("window");

const SendConfirmationPage = ({ navigation, route, style }) => {
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

  const handleRedirect = (id) => {
  navigation.navigate("AddCustomerImage");
    // navigation.navigate("SendCashConfirmation");
  };

  const handleStartFinishJob = async () => {

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
      Amount: parseFloat(total),
      Flag: 1,
      Othercash: 100,
      PaymentMode: "cash",
    };

    console.log('PAYLOAD',json);

    try {
      setshowSpinner(true);
      const BASEURL=`${URLDRIVER}UpdateStaticPayment`
      console.log("ddddddddddd::::::",BASEURL);
      axios
        .post(BASEURL, json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("RESPONSE::::",response);
          setshowSpinner(false);
            Alert.alert(
                'Success',
                'Cash has been received!',
                [
                  {
                    text: 'OK',
                    onPress: handleOkPress,
                  },
                ],
                { cancelable: false }
              );
         
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
      setshowSpinner(false);
    }
  };
  const handleOkPress=()=>{
    handleRedirect("1");
  }

   useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            return true; // Prevent default back behavior
          }
        );
    
        return () => backHandler.remove();
      }, [navigation]);


  return (
    <SafeAreaWrapper>
    <Block>
      {showSpinner && <OverlaySpinner />}
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
            Cash
          </Text>
        </Block>
      </Block>
      <Block style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          <Block style={styles.SectionOne}>
            <Block>
              <Text
                // style={{ fontFamily: "montserrat-regular" }}
                size={16}
                style={[styles.Text,{ fontFamily: "montserrat-regular" }]}
                color={theme.COLORS.SECONDARY}
              >
                Have you recieved the amount below by customer for{" "}
                <Text style={styles.TextBold}>Job Id : {JobIds}</Text>?
              </Text>
            </Block>

            <Block>
              <Text
                // style={{ fontFamily: "montserrat-regular" }}
                size={14}
                style={[styles.Amount,{ fontFamily: "montserrat-regular" }]}
                color={theme.COLORS.SECONDARY}
              >
                $ {total}
              </Text>
            </Block>
          </Block>
          <Block center style={styles.JobButton}>
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
              small
              center
              color="success"
              style={styles.optionsButtonStart}
              onPress={handleStartFinishJob}
            >
              Cash Received
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
    paddingTop: 100,
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
    paddingBottom: 10,
    textAlign: "center",
  },
  TextBold: {
    color: "#000",
    paddingBottom: 10,
    textAlign: "center",
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
  icons: {
    marginRight: -20,
    fontSize: 30,
  },
});

export default SendConfirmationPage;
