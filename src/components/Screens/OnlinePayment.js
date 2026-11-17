import React, { useEffect, useState, Linking } from "react";

import axios from 'axios';

import { Dimensions, StyleSheet, ScrollView, Platform,View, ActivityIndicator, BackHandler, Alert } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { OverlaySpinner } from "../../utils/Spinner";

import { Block, Button, Input, NavBar, Text, theme } from "galio-framework";

import {
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  STORAGE_SUM,
  URLPAYMENT,
  URLDRIVER,
  STORAGE_NAME,
  STORAGE_PERSONNAME
} from "../../utils/factory";

import AntDesign from "react-native-vector-icons/AntDesign";

import uuid from "react-native-uuid";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { InAppBrowser } from "react-native-inappbrowser-reborn";

import {
  SQIPCardEntry,
  SQIPApplePay,
  SQIPCore,
  SQIPGooglePay,
} from "react-native-square-in-app-payments";
import SafeAreaWrapper from "../SafeAreaWrapper";

const uniqueId = uuid.v4();

//Sandbox
// const paymenturl = "https://connect.squareupsandbox.com/v2/payments";
// const key = "Bearer EAAAECJY57IyjcmkRw3QbWGJXWVHGTxjiUiVJaiEba7CX1AB2eKTRQ1OZES9BfyX";
// const locationid = "LAKHK69ZSE4QY";

//Production
const paymenturl = "https://connect.squareup.com/v2/payments";
const key = "Bearer EAAAEHfa4Hg2SXjcT7Qs_3F2TAw2aLtKzExhDthBje36ezr_MxMQDpCB2V1Hjlsn";
const locationid = "NJBHMTDD8S5ZN";


const { height, width } = Dimensions.get("window");

const OnlinePayment = ({ navigation, route, style }) => {

  const [total, setTotal] = useState();

  const [JobIds, setJobIds] = useState();

  const [openBrowser, setOpenBrowser] = useState("");

  const [ccPer, setCcPer] = useState(0);

  const [ccAmount, setCcAmount] = useState(0);

  const [uniqueId, setUniqueId] = useState(uuid.v4());
  const [loading, setLoading] = useState(false);


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
      setLoading(false); 
      await SQIPCardEntry.completeCardEntry(() => {
        processpayment(cardDetails.nonce);
        //navigation.navigate("SendCashConfirmation");
      });
    } catch (ex) {
      setLoading(false); 
      await SQIPCardEntry.showCardNonceProcessingError(ex.ErrMsg);
    }
  };

  const onCardEntryCancel = async () => {
    try {
   //   console.log('222222222222222222222222222222222222', JSON.stringify(cardDetails))
   setLoading(false);
      await SQIPCardEntry.completeCardEntry(() => {});
    } catch (ex) {
      setLoading(false);
     // alert("Please try again");
      
    }
  };

  const showCardNonceProcessingError = async () => {
    alert("Card Process Failed");
  };

  const onStartCardEntry = async (uniqueId) => {
   
    try {
      if (!uniqueId) {
              alert("Square Location ID is missing");
              return;
      }

    if (isNaN(total) || isNaN(ccAmount)) {
        alert("Invalid total or ccAmount");
        return;
      }
      const cardEntryConfig = {
        collectPostalCode: false,
        squareLocationId: uniqueId,
        buyerAction: "Charge",
        amount: Math.floor(parseFloat((parseFloat(total) + parseFloat(ccAmount.toFixed(2)))) * 100),
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

      console.log("333333333333333333333333333333333333", cardEntryConfig)

      
     
        await SQIPCardEntry.startCardEntryFlow(
          cardEntryConfig,
          onCardNonceRequestSuccess,
          onCardEntryCancel,
          showCardNonceProcessingError
        );
    
      setLoading(false); 
     
    } catch (ex) {
      setLoading(false); 
      alert(ex);
     await SQIPCardEntry.showCardNonceProcessingError(ex.ErrMsg);
    }
  };

  // Payament Process
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
            amount: Math.floor(parseFloat((parseFloat(total) + parseFloat(ccAmount.toFixed(2)))) * 100),
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
      // Payment Response
      console.log("ttttttttttttttttttttttttttttttt",responseJson);
      //======================== Call Save Card Response =========================
      await handleSaveCardResponse(responseJson)
      let responseNode = Object.keys(responseJson)[0];
      if (responseNode != "errors") {
        handleRefreshPageMultiple();

        if (responseJson.errorMessage != null) {
          throw new ChargeCustomerCardError(responseJson.errorMessage);
        }

        if (responseJson.payment.status == "COMPLETED") {
          handleOnlinePaymentCall();
          // Alert.alert("Success","Card Payment Successfuly");
          Alert.alert(
                          'Success',
                          'Card Payment Completed Successfully',
                          [
                            {
                              text: 'OK',
                              onPress: handleOkPress,
                            },
                          ],
                          { cancelable: false }
                        );
         
          // navigation.navigate("SendCashConfirmation");
        }
        else {
          alert("unfortunately the payment for this job has failed, please try again.");
          setUniqueId(uuid.v4());
        }
      }
      else {
        setUniqueId(uuid.v4());
        alert("unfortunately the payment for this job has failed, please try again..");
      }
    } catch (error) {
      setUniqueId(uuid.v4());
      alert("unfortunately the payment for this job has failed, please try again...");
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
    console.log("##################################3", json)

    try {
      const CardRESURL=`${URLDRIVER}SaveCardResponse`;
      console.log("URSSSS",CardRESURL);
      axios
        .post(CardRESURL, json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response Card:::",response);
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

  const openLink = async (uniqueId, total) => {
    try {
      const url = `http://localhost:3000/examples/card?id=${uniqueId}$pid=${total}`;
      if (InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: "cancel",
          preferredBarTintColor: "#453AA4",
          preferredControlTintColor: "white",
          readerMode: false,
          animated: true,
          modalPresentationStyle: "fullScreen",
          modalTransitionStyle: "coverVertical",
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: "#6200EE",
          secondaryToolbarColor: "black",
          navigationBarColor: "black",
          navigationBarDividerColor: "white",
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: "slide_in_right",
            startExit: "slide_out_left",
            endEnter: "slide_in_left",
            endExit: "slide_out_right",
          },
          headers: {
            "my-custom-header": "my custom header value",
          },
        });
        setOpenBrowser(result.type);

        // await this.sleep(800);
        //  Alert.alert(JSON.stringify(result));
      } else Linking.openURL(url);
    } catch (error) {
      // Alert.alert(error.message);
    }
  };

 


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
        alert("please try again catch");
      }
    };
    handleJobData();
  }, []);

  const handleOnlinePayment = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    setLoading(true); // 🔄 Show loader
    const json = {
      IsSuccess: 0,
      JobId: JSON.parse(jobid),
      Status: "Pending",
      ProcessId: uniqueId,
      action: "Save",
      DriverId: driverid,
      Amount: JSON.parse(total),
    };

    console.log("ddddddddddyyyy",json);
    try {
      const appPamentURL=`${URLPAYMENT}AppPGStatus`
      console.log(":DDDDD",appPamentURL);
      axios
        .post(appPamentURL, json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("RESPONSE",response);
          if (response.data == 1) {
            onStartCardEntry(uniqueId, total, JobIds);
          }
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      console.log(error);
      //  setshowSpinner(false);
    }
  };

  const handleRefreshPageMultiple = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      IsSuccess: 1,
      JobId: JSON.parse(jobid),
      Status: "Success",
      ProcessId: uniqueId,
      action: "Update",
      Driverid: driverid,
    };

    try {
      axios
        .post(URLPAYMENT + "AppPGStatus", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("6666666666666666666666666666666");
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      console.log(error);
      //  setshowSpinner(false);
    }
  };

  const handleOnlinePaymentCall = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      JobId: JSON.parse(jobid),
      OnlineTxnId: uniqueId,
      Driverid: driverid,
      Amount: JSON.parse(total),
      Flag: 1,
      CCPer: 2,
      CCAmount: JSON.parse(total),
      PaymentMode: "Card",
    };


    try {
      axios
        .post(URLDRIVER + "UpdatePaymentOnline", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("done", response);
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

  const handlePercentageOnMix = async () => {
    const json = {
      JobPrice: JSON.parse(total),
    };
    setLoading(true)
    console.log("PAYMENT ><>>>>>>>>>>",json);
    try {
      const paymentURL=`${URLPAYMENT}GetCCCharges`
      console.log("::URL",paymentURL);
      await axios
        .post(paymentURL, json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("RESPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",response);
          if(response && response?.data?.ret){
            const responseData = JSON.parse(response?.data?.ret);
            setCcPer(responseData?.CCPer);
            setLoading(false)
          }
          
        })
        .catch((error) => {
          console.log("API error1", error);
          setLoading(false)
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      setLoading(false)
      console.log(error);
      //  setshowSpinner(false);
    }
  };
  useEffect(() => {
    handlePercentageOnMix();
  }, [total]);

  useEffect(() => {
    let ccAmount = 0;
    ccAmount = (total * ccPer) / 100;

    setCcAmount(ccAmount);
  }, [ccPer]);

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
            Online Payment
          </Text>
        </Block>
      </Block>
      {loading && <OverlaySpinner />}
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
                Are you sure you want to proceed with card payment for{" "}
                <Text style={styles.TextBold}>Job Id : {JobIds}</Text> and the
                amount mentioned below?
              </Text>
            </Block>

            <Block>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                // style={{ fontFamily: "montserrat-regular" }}
                size={14}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                style={[styles.Amount,{ fontFamily: "montserrat-regular" }]}
                color={theme.COLORS.SECONDARY}
              >
                $ {total}
              </Text>
            </Block>

            <Block center>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                // style={{ fontFamily: "montserrat-regular" }}
                size={16}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                style={[styles.CCText,{ fontFamily: "montserrat-regular" }]}
                color={theme.COLORS.SECONDARY}
              >
                {ccPer}
                {"%"} credit card charges{" "}
                <FontAwesome
                  size={12}
                  style={styles.FontAwesome}
                  name="dollar"
                  family="NowExtra"
                />{" "}
                <Text style={{ fontWeight: "bold", color: "#505050" }}>
                  {isNaN(ccAmount.toFixed(2))? '0.00' :ccAmount.toFixed(2)}{" "}
                </Text>
                will be applicable
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
              onPress={handleOnlinePayment}
            >
              Proceed
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
  icons: {
    marginRight: -20,
    fontSize: 30,
  },
  CCText: {
    fontSize: 13,
    marginTop: 8,
  },
  FontAwesome: {
    marginRight: 5,
    color: "#505050",
  },
});

export default OnlinePayment;
