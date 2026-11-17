import React, { useEffect, useState } from "react";

import axios from 'axios';

import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Block, Button, Text, } from "galio-framework";

import {
  URL,
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URLDRIVER,
  STORAGE_SIGN,
  STORAGE_SIGNATURE,
} from "../../utils/factory";

import AntDesign from "react-native-vector-icons/AntDesign";

import PaymentDetail from "../Payment/PaymentDetail";

import PaymentMethod from "../Payment/PaymentMethod";

import Signature from "../Payment/Signature";

import { OverlaySpinner } from "../../utils/Spinner";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import SignaturePad from "../Payment/SignatureFunction";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const Paymentpage = ({ navigation, route, style }) => {

  const [savedData, setSavedData] = useState();

  const [paymentType, setPaymentType] = useState();
  const [signatureImg, setSignatureImg] = useState(null);


  const [fuel, setFuel] = useState("");

  const [paymentMethods, setPaymentMethods] = useState("");

  const [showSpinner, setshowSpinner] = useState(false);

  const [otherAmount, setOtherAmount] = useState("");

  const [otherToll, setOtherToll] = useState("");

  const [amountThird, setAmountThird] = useState("");

  console.log("savedData", savedData && savedData.amountFirst);

  const [jobTiming, setJobTiming] = useState("");

  const handleStartFinishJob = async () => {
    
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
    };
    console.log("dddddddddddsqwsdqwdqwjson",json);
    try {
      setshowSpinner(true);
      const paymentDetailsURL=`${URLDRIVER}GetPaymentDetails`;
      console.log("PMTURL",paymentDetailsURL);
      await axios
        .post(paymentDetailsURL, json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response?.data;
          console.log("Payment Response>>>>>>>",response.data);
          const paymentmethod = responseData.paymentMethod;
          setPaymentMethods(paymentmethod);
          setFuel(responseData.fuelcharge);
          setJobTiming(responseData);
          setshowSpinner(false);
        })
        .catch((error) => {
          console.log(`Api Error at handleStartFinishJob. ${error}`);
          // handleStartFinishJob();
        })
        .finally(function () {
          setshowSpinner(false);
        });
    } catch (error) {
      console.log(`Api Error at handleStartFinishJob.. ${error}`);

      // handleStartFinishJob();
      setshowSpinner(false);
    }
  };

  const handleRedirectMixPayment = (id) => {
    navigation.navigate("MixPayment");
  };

  const handleRedirectOnlinePayment = (id) => {
    navigation.navigate("OnlinePayment");
  };

  const handleRedirectPaymentCashPage = (id) => {
    navigation.navigate("PaymentCashPage");
  };

  const handleRedirectPaymentInvoice = (id) => {
    navigation.navigate("Invoice");
  };

  const handleFormDetails = async () => {
    const sign = await AsyncStorage.getItem(STORAGE_SIGN);
    const signature = await AsyncStorage.getItem(STORAGE_SIGNATURE);
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    let other = 0;
    let tollData = 0;

    if (otherAmount[0] == '.') {
      other = `0${otherAmount}`;
    } else {
      other = otherAmount;
    }

    if (otherToll[0] == '.') {
      tollData = `0${otherToll}`;
    } else {
      tollData = otherToll;
    }
    // const tollValueData=JSON.parse(tollData)
    // if(!tollData){
    //   alert("Enter the toll amount!")
    //   return;
    // }
    // if(!other){
    //   alert("Enter the other amount!")
    //   return;
    // }

    if(!paymentType){
      alert("select the payment method!")
      return;
    }

    if(!sign){
      alert("Signature is mandatory");
      setshowSpinner(false)
      return;
    }
    const json = {
      DriverId: driverid,
      JobId: jobid ? JSON.parse(jobid) : "",
      OtherName: amountThird ? amountThird : "",
      OtherAmt: other? JSON.parse(other) : 0,
      Description: "Job Temp data",
      Signature: signature,
      Units: jobTiming?.JobUnit
      ,
      Toll: tollData ? JSON.parse(tollData) : 0,
    };
    // console.log("qwdwedwefdwe",json);
    if (sign == "dragged") {
      try {
        
        setshowSpinner(true)
        axios
          .post(URLDRIVER + "SaveTempPayData", json, {
            headers: {
              // Authorization:
              //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("resssssssssssssssssssssss",paymentType);
            if (paymentType && paymentType == "1") {
              handleRedirectPaymentCashPage("1");
            }
            if (paymentType && paymentType == "2") {
              handleRedirectOnlinePayment("2");
            }
            if (paymentType && paymentType == "3") {
              handleRedirectMixPayment("1");
            }
            if (paymentType && paymentType == "4") {
              handleRedirectPaymentInvoice("4");
            }
            if (response.status === 200) {
              console.log("hello");
            } else {
              //            setNotFound(true);
            }
            setshowSpinner(false);
          })
          .catch((error) => {
            console.log("API Then error Inside handle Form Details Payment Page", error);
          })
          .finally(function () {
            setshowSpinner(false)
          });
      } catch (error) {
        console.log("API catch error Inside handle Form Details Payment Page", error);
        setshowSpinner(false)

      }
    }
  };

  useEffect(() => {
    const data = async () => {
      await handleStartFinishJob();
    }
    data();
  }, []);

  const handleAllData = (data) => {
    setSavedData(data);
  };

  const handleCheckedType = (type) => {
    setPaymentType(type);
  };

  const handleOtherAmount = (data) => {
    setOtherAmount(data);
  };

  const handleOtherToll = (data) => {
    setOtherToll(data);
  };

  const handleamountThird = (data) => {
    setAmountThird(data);
  };

  // Signature Image display
  // useEffect(()=>{
  //   const loadImage = async () => {
  //     try {
  //       const signatureImgage = await AsyncStorage.getItem(STORAGE_SIGNATURE);
  //       if (signatureImgage) {
  //         // Convert binary to base64 URI
  //         const base64Image = `data:image/png;base64,${signatureImgage}`;
  //         setSignatureImg(base64Image);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load signature:', error);
  //     }
  //   };

  //   loadImage();
  // },[])


  console.log("img",signatureImg);

  return (
    <SafeAreaWrapper>
    <Block style={styles.container}>
      {showSpinner && <OverlaySpinner />}

      <Block row style={styles.Headers}>
        <Block flex row>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={styles.BackText}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            // style={styles.cardTitle}
            // color={theme.COLORS.SECONDARY}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" style={styles.BackIcon} />
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={styles.Joblisttitle}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            // style={styles.cardTitle}
            // color={theme.COLORS.SECONDARY}
          >
            Job Time {jobTiming.exactjobtime}
          </Text>

          <Text style={styles.btnRefresh} onPress={handleStartFinishJob}>
            Refresh{"  "}
            <FontAwesome
              style={styles.refreshIcon}
              name="refresh"
              color={"#fff"}
              size={12}
              onPress={handleStartFinishJob}
            />
          </Text>
        </Block>
      </Block>
      <Block style={styles.containertwo}>
        <ScrollView
          style={{ marginBottom: 15 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          {/* {jobTiming &&
          jobTiming.length > 0 &&
          jobTiming.map(item => (
            <> */}

          <Block style={styles.SectionOne}>
            <Block row style={styles.blockRed}>
              <Block>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles

                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  style={styles.ListTitleLeft}
                  // color={theme.COLORS.SECONDARY}
                >
                  Job Timing
                </Text>
              </Block>

              <Block flex right>
                {jobTiming.pricetype == '1' ?
                  (<Text
                    // eslint-disable-next-line react-native/no-inline-styles

                    size={14}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    style={styles.ListTitleRight}
                    // color={theme.COLORS.SECONDARY}
                  >

                    {jobTiming.jobtime_Hr}

                  </Text>)
                  :
                  (<Text> N/A </Text>)}

              </Block>
            </Block>

            {jobTiming.isMin == 1 ? (
              <Block row style={styles.blockAqua}>
                <Block>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles

                    size={14}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    style={styles.ListTitleLeft}
                    // color={theme.COLORS.SECONDARY}
                  >
                    Minimum Job Time
                  </Text>
                </Block>

                <Block flex right>
                  {jobTiming.pricetype == '1' ?

                    <Text
                      // eslint-disable-next-line react-native/no-inline-styles

                      size={14}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      style={styles.ListTitleRight}
                      // color={theme.COLORS.SECONDARY}
                    >
                      {jobTiming.minJobtime_Hr}
                    </Text>
                    :
                    <Text> N/A</Text>
                  }
                </Block>
              </Block>
            ) : null}

            <Block row style={styles.blockGreen}>
              <Block>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles

                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  style={styles.ListTitleLeft}
                  // color={theme.COLORS.SECONDARY}
                >
                  Travel Timing
                </Text>
              </Block>

              <Block flex right>
                {jobTiming.pricetype == '1' ?

                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles

                    size={14}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    style={styles.ListTitleRight}
                    // color={theme.COLORS.SECONDARY}
                  >
                    {jobTiming.travelmin_Hr}
                  </Text>
                  :
                  <Text> N/A</Text>
                }
              </Block>
            </Block>
            <Block row style={styles.blockBlue}>
              <Block>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles

                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  style={styles.ListTitleLeft}
                  // color={theme.COLORS.SECONDARY}
                >
                  Total Payable Time
                </Text>
              </Block>

              <Block flex right>
                {jobTiming.pricetype == '1' ?

                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles

                    size={14}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    style={styles.ListTitleRight}
                    // color={theme.COLORS.SECONDARY}
                  >
                    {jobTiming.finalJobTimeMin_Hr}
                  </Text>
                  :
                  <Text> N/A</Text>
                }
              </Block>
            </Block>

            {jobTiming.AdvanceAmt > 0 ? (
              <Block row style={styles.blockGrey}>
                <Block>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles

                    size={14}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    style={{
                      color: "#000",
                      paddingBottom: 10,
                      width: 190,
                      textTransform: "uppercase",
                    }}
                    // color={theme.COLORS.SECONDARY}
                  >
                    Advance Booking Amount
                  </Text>
                </Block>

                <Block flex right>


                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles

                    size={14}
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    style={styles.ListTitleRight}
                    // color={theme.COLORS.SECONDARY}
                  >
                    $ {jobTiming.AdvanceAmt}
                  </Text>

                </Block>
              </Block>
            ) : null}

          </Block>

          <PaymentDetail
            handleAllData={handleAllData}
            handleTotalCost={jobTiming}
            handelFule={fuel}
            handelPaymentMode={paymentMethods}
            handleOtherAmount={handleOtherAmount}
            handleOtherToll={handleOtherToll}
            handleamountThird={handleamountThird}
          // handleInvoice={paymentType && paymentType}
          />
          {/* <Signature />  old is not working */}
          <View>
          {/* {signatureImg && (
              <Image
                source={{ uri: signatureImg && signatureImg }}
                style={{ width: 100, height: 120, alignSelf: 'center', marginTop: 20 }}
                 resizeMode="contain"
              />
            )} */}
          <SignaturePad />
          </View>
         

          <PaymentMethod
            handleCheckedType={handleCheckedType}
            handelPaymentMode={paymentMethods}
          />
        </ScrollView>
        <Block flex center style={styles.JobButton}>
          <Button
            textStyle={{ fontSize: 15 }}
            small
            center
            round
            color="success"
            style={styles.optionsButtonStart}
            onPress={handleFormDetails}
          >
            Proceed
          </Button>
        </Block>
      </Block>
    </Block>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    //paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
  },
  containertwo: {
    // paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    paddingTop: 10,
    width: width,
    paddingBottom: 100,
  },
  articles: {
    paddingBottom: 0,
  },
  Headers: {
    backgroundColor: "#3498DB",
    padding: 15,
  },
  BackText: {
    // color: theme.COLORS.BLACK,
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
  ListTitleLeft: {
    color: "#000",
    paddingBottom: 10,
    width: 140,
    textTransform: "uppercase",
  },
  ListTitleLeftBold: {
    color: "#000",
    paddingBottom: 10,
    width: 140,
    fontWeight: "bold",
  },
  ListTitleRight: {
    color: "#000",
    paddingBottom: 10,
  },
  ListTitleRightBold: {
    color: "#000",
    paddingBottom: 10,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  SectionOne: {
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 10,
    paddingHorizontal:10,
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
    bottom: 60,
    backgroundColor: "#fff",
    zIndex: 999,
    right: -10,
    height: 100,
  },
  optionsButtonStart: {
    backgroundColor: "#5fd27f",
    width: 114,
    height: 40,
    marginHorizontal: 5,
    elevation: 0,
    marginBottom: 20,
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
  Joblisttitlerefresh: {
    paddingLeft: 5,
    paddingTop: 7,
  },
  refreshBtn: {
    color: "#fff",
    fontSize: 13,
  },
  btnRefresh: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 80,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    marginLeft: 90,
    color: "#fff",
    textAlign: "center",
    paddingTop: 3,
  },
  refreshIcon: {
    fontSize: 12,
  },
  blockRed: {
    backgroundColor: "#FFDEDE",
    borderLeftColor: "#FA6E6E",
    borderLeftWidth: 5,
    paddingLeft: 5,
    paddingTop: 7,
    borderRadius: 5,
    paddingRight: 10,
    marginBottom: 8,
  },
  blockGreen: {
    backgroundColor: "#E7FFDE",
    borderLeftColor: "#8BD76E",
    borderLeftWidth: 5,
    paddingLeft: 5,
    paddingTop: 7,
    borderRadius: 5,
    paddingRight: 10,
    marginBottom: 8,
  },
  blockBlue: {
    backgroundColor: "#C6EFFF",
    borderLeftColor: "#389CC4",
    borderLeftWidth: 5,
    paddingLeft: 5,
    paddingTop: 7,
    borderRadius: 5,
    paddingRight: 10,
    marginBottom: 8,
  },
  blockAqua: {
    backgroundColor: "#C4FFFC",
    borderLeftColor: "#15D8CE",
    borderLeftWidth: 5,
    paddingLeft: 5,
    paddingTop: 7,
    borderRadius: 5,
    paddingRight: 10,
    marginBottom: 8,
  },
  blockGrey: {
    backgroundColor: "#F9F9F9",
    borderLeftColor: "#7f8c8d",
    borderLeftWidth: 5,
    paddingLeft: 5,
    paddingTop: 7,
    borderRadius: 5,
    paddingRight: 10,
    marginBottom: 8,
  },
});

export default Paymentpage;
