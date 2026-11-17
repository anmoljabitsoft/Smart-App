import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Dimensions, StyleSheet, Platform, ScrollView, Alert, BackHandler } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// galio component
import { Block, Button, Input, NavBar, Text, theme } from "galio-framework";
import {
  STORAGE_DRIVERID,
  URLDRIVER,
  STORAGE_JOBID,
  STORAGE_SUM,
  STORAGE_PERSONNAME,
} from "../../utils/factory";
import AntDesign from "react-native-vector-icons/AntDesign";
import MixPaymentDetail from "../Payment/MixPaymentDetail";
import uuid from "react-native-uuid";
import { SQIPCardEntry } from "react-native-square-in-app-payments";
import { OverlaySpinner } from "../../utils/Spinner";
import SafeAreaWrapper from "../SafeAreaWrapper";
const { height, width } = Dimensions.get("window");

// const uniqueId = uuid.v4();


const MixPayment = ({ navigation, route, style }) => {
  const [paymentDetails, setPaymentDetails] = useState();
  const [allPaymentTotal, setAllPaymentTotal] = useState();
  const [Total, setTotal] = useState();
  const [JobIds, setJobIds] = useState();
  const [showSpinner, setshowSpinner] = useState(false);
  const [totalCardAndPer, setTotalCardAndPer] = useState();
  const [uniqueId, setUniqueId] = useState(uuid.v4());

  //Sandbox
  // const paymenturl = "https://connect.squareupsandbox.com/v2/payments";
  // const key = "Bearer EAAAECJY57IyjcmkRw3QbWGJXWVHGTxjiUiVJaiEba7CX1AB2eKTRQ1OZES9BfyX";  
  // const locationid = "LAKHK69ZSE4QY";

  //Production
  const paymenturl = "https://connect.squareup.com/v2/payments";
  const key = "Bearer EAAAEHfa4Hg2SXjcT7Qs_3F2TAw2aLtKzExhDthBje36ezr_MxMQDpCB2V1Hjlsn";
  const locationid = "NJBHMTDD8S5ZN";


  if (Platform.OS === "ios") {
    SQIPCardEntry.setIOSCardEntryTheme({
      saveButtonFont: {
        size: 25,
      },
      saveButtonTitle: "Add 💳 ",
      keyboardAppearance: "Light",
      saveButtonTextColor: {
        r: 255,
        g: 0,
        b: 125,
        a: 0.5,
      },
    });
  }

  const onCardNonceRequestSuccess = async (cardDetails) => {
    try {
      await SQIPCardEntry.completeCardEntry(() => {
        // alert(JSON.stringify(cardDetails.nonce));
        //    alert("Payment Successfully Completed");
        //    handleOnlinePaymentCall();
        // alert(JSON.stringify("Payment Successful"));
        processpayment(cardDetails.nonce);
        //  navigation.navigate("SendCashConfirmation");
      });
    } catch (ex) {
      await SQIPCardEntry.showCardNonceProcessingError(ex.ErrMsg);
    }
  };

  const onCardEntryCancel = async () => {
    try {

      await SQIPCardEntry.completeCardEntry(() => { });
    } catch (ex) {
      alert("Please try again");
    }
  };

  const showCardNonceProcessingError = async () => {
    alert("Card Process Failed");
  };

  const onStartCardEntry = async (uniqueId) => {
    try {
      const cardEntryConfig = {
        collectPostalCode: false,
        squareLocationId: uniqueId && uniqueId,
        buyerAction: "Charge",
        amount: Math.floor(parseFloat(totalCardAndPer) * 100),
        currencyCode: "AUD",
        givenName: "John",
        familyName: "Doe",
        addressLines: ["London Eye", "Riverside Walk"],
        city: "London",
        countryCode: "GB",
        email: "johndoe@example.com",
        phone: "8001234567",
        postalCode: "SE1 7",
        jobId: JobIds,
      };


      await SQIPCardEntry.startCardEntryFlow(
        cardEntryConfig,
        onCardNonceRequestSuccess,
        onCardEntryCancel,
        showCardNonceProcessingError
      );
    } catch (ex) {
      alert(ex);
      await SQIPCardEntry.showCardNonceProcessingError(ex.ErrMsg);
    }
  };

  const processpayment = async (cardid) => {

    const name = await AsyncStorage.getItem(STORAGE_PERSONNAME);

    const jobdesc = `${JSON.parse(JobIds)} - Collected By ${name}`;


    const response = await fetch(
      paymenturl,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            key,
        },
        body: JSON.stringify({
          source_id: cardid,
          idempotency_key: uniqueId,
          amount_money: {
            amount: Math.floor(parseFloat(totalCardAndPer) * 100),
            currency: "AUD",
          },
          autocomplete: true,
          locationId: locationid,
          referenceId: JobIds,
          note: jobdesc,
        }),
      }
    );

    try {
      const responseJson = await response.json();
      handleSaveCardResponse(responseJson)
      // alert(JSON.stringify(responseJson));
      //   handleRefreshPageMultiple();
      if (responseJson.errorMessage != null) {
        throw new ChargeCustomerCardError(responseJson.errorMessage);
      }
      //       responseJson;

      if (responseJson.payment.status == "COMPLETED") {
        
        // alert("Payment Successfully Completed");
        handleOnlinePaymentCall();

        Alert.alert('Success','Payment Completed Successfully',
          [
            {
              text: 'OK',
              onPress: handleOkPress,
            },
          ],
          { cancelable: false }
        );

        
        // navigation.navigate("SendCashConfirmation");
        // alert(JSON.stringify(responseJson.payment.status));
      } else {
        setUniqueId(uuid.v4());
        alert("Failed");
      }
    } catch (error) {

      throw new ChargeCustomerCardError(error.message);
    }
  };

  const handleOkPress=()=>{
    navigation.navigate("AddCustomerImage");
  }

  const handleSaveCardResponse = async (response) => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      BookingId: JSON.parse(jobid),
      DriverId: driverid,
      CardResponse: JSON.stringify(response),
    };

    try {
      axios
        .post(URLDRIVER + "SaveCardResponse", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Done Data")
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAllData = (data) => {
    setPaymentDetails(data);
  };

  const handleAllTotal = (total) => {
    let data = parseFloat(total).toFixed(2);
    setAllPaymentTotal(data);
  };

  const handleCardAndPercentagesAmount = (data) => {
    setTotalCardAndPer(data);
  };

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_SUM);
        if (value !== null) {
          setTotal(JSON.parse(value));
        }
      } catch (error) {
        alert("please try again catch1");
      }
    };
    retrieveData();
  }, []);


  const handelRedirectToCashPage = () => {
    navigation.navigate("SendCashConfirmation");
  };

  const handleStartFinishJob = async () => {
    if (!paymentDetails.cash) {
      alert("Please enter cash amount");
    } else if (!paymentDetails.online) {
      alert("Please enter card amount");
    } else if (allPaymentTotal != Total) {
      alert("Cash and Card amount should be match with the total amount");
    }

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
      JobPrice: JSON.parse(Total),
      CashAmt: JSON.parse(paymentDetails && paymentDetails.cash),
      ChequeAmt: 0,
      InvoiceAmt: 0,
      OnlineAmt: JSON.parse(paymentDetails && paymentDetails.online),
    };
    try {
      if (allPaymentTotal == Total) {
        setshowSpinner(true);
        axios
          .post(URLDRIVER + "SaveTempMixPayAmt", json, {
            headers: {
              Authorization:
                "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            setshowSpinner(false);
            onStartCardEntry(uniqueId);
          })
          .catch((error) => {
            console.log("API error", error);
            setshowSpinner(false);
          })
          .finally(function () {
            setshowSpinner(false);

            // always executedr
            //handleClear();
          });
      }
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
      //  setshowSpinner(false);
    }
    // alert("Job completed successfully");
    // navigation.navigate("SecondPage");
  };

  const handleOnlinePaymentCall = async () => {
    console.log("dddddwpyamneytcallllllllllllllllllllllllllllllllllllll");
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      JobId: JSON.parse(jobid),
      OnlineTxnId: uniqueId,
      Driverid: driverid,
      Amount: JSON.parse(Total),
      Flag: 1,
      CCPer: 2,
      CCAmount: JSON.parse(paymentDetails && paymentDetails.online),
      PaymentMode: "Card & Cash",
    };

    console.log("dddddwpyamneyt",json);
    try {
      axios
        .post(URLDRIVER + "UpdatePaymentOnline", json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("done>>>>>>>>>>>>>>>>>>>>", response);
        })
        .catch((error) => {
          console.log("API error1", error);
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      console.log(error);
      //  setshowSpinner(false);
    }
  };

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


  // Restrict Back button
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
            // eslint-disable-next-line react-native/no-inline-styles
            style={styles.BackText}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            // style={styles.cardTitle}
            color={theme.COLORS.SECONDARY}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" style={styles.BackIcon} />
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={styles.Joblisttitle}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            // style={styles.cardTitle}
            color="#fff"
          >
            Mix Payment
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
                // eslint-disable-next-line react-native/no-inline-styles
                // style={{ fontFamily: "montserrat-regular" }}
                size={16}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                style={[styles.Text,{ fontFamily: "montserrat-regular" }]}
                color={theme.COLORS.SECONDARY}
              >
                Total amount to be recieved by customer
              </Text>
            </Block>

            <Block>
              <Text
                style={[styles.Amount,{ fontFamily: "montserrat-regular" }]}
                size={14}
                color={theme.COLORS.SECONDARY}
              >
                $ {Total}
              </Text>
            </Block>
          </Block>
          <Block>
            <Text
              size={16}
              style={[styles.TextTwo,{ fontFamily: "montserrat-regular" }]}
              color={theme.COLORS.SECONDARY}
            >
              Amount paid in
            </Text>
          </Block>

          <MixPaymentDetail
            handleAllData={handleAllData}
            handleAllTotal={handleAllTotal}
            handleCardAndPercentagesAmount={handleCardAndPercentagesAmount}
          />

          <Block middle row style={styles.JobButton}>
            {/* {allPaymentTotal == Total ? ( */}
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
              small
              center
              color="success"
              style={
                allPaymentTotal == Total
                  ? styles.optionsButtonStart
                  : styles.optionsButtonStartDisable
              }
              onPress={handleStartFinishJob}
            >
              Proceed
            </Button>
            {/* ) : null} */}
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
    paddingBottom: 10,
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
  optionsButtonStartDisable: {
    backgroundColor: "#A6E6B8",
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

export default MixPayment;
