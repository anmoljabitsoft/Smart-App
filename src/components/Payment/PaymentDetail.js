import React, { useEffect, useState } from "react";

import axios from "axios";

import { Dimensions, StyleSheet, View } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Block, Input, Text, theme } from "galio-framework";

import {
  URLDRIVER,
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  STORAGE_SUM,
} from "../../utils/factory";

import FontAwesome from "react-native-vector-icons/FontAwesome";

const { height, width } = Dimensions.get("window");

const PaymentDetail = ({
  navigation,
  handleAllData,
  handleTotalCost,
  handelFule,
  handelPaymentMode,
  handleOtherAmount,
  handleOtherToll,
  handleamountThird,
}) => {

  const [quote, setQuote] = React.useState({
    amountFirst: "",
    amountSecond: "",
    amountThird: "",
    amountFour: "",
  });

  const [otherFreeze, setotherFreeze] = useState('');


  let sumOfAll = 0;

  const [totalAmount, setTotalAmount] = React.useState(0);

  let second = parseFloat(quote.amountSecond) + parseFloat(quote.amountFour);

  // useEffect(() => {
  //   let toll = quote.amountSecond ? (parseFloat(quote.amountSecond) > 0 ? parseFloat(quote.amountSecond) : 0) : 0;
  //   let other = quote.amountFour ? (parseFloat(quote.amountFour) > 0 ? parseFloat(quote.amountFour) : 0) : 0;
  //   toll = toll + other;
  //   const sumOfAll = parseFloat(handleTotalCost.jobprice) + parseFloat(handelFule) + parseFloat(toll);
  //   const storeData = async () => {
  //     try {
  //       await AsyncStorage.setItem(STORAGE_SUM, JSON.stringify(sumOfAll));
  //     } catch (error) {
  //       alert("please try again");
  //     }
  //   };
  //   storeData();
  // }, [sumOfAll])

  useEffect(() => {
    const saveData = async () => {
      await handleSavedData();
    }

    sumOfAll =
      parseFloat(handleTotalCost?.jobprice) + parseFloat(handelFule) + parseFloat(second);

    sumOfAll = (sumOfAll).toFixed(2);
    console.log("Total Amount::",sumOfAll);
    setTotalAmount(sumOfAll && sumOfAll);

    saveData();
  }, [handleTotalCost, handelFule]);

  useEffect(() => {
    let toll = quote.amountSecond ? (parseFloat(quote.amountSecond) > 0 ? parseFloat(quote.amountSecond) : 0) : 0;
    let other = quote.amountFour ? (parseFloat(quote.amountFour) > 0 ? parseFloat(quote.amountFour) : 0) : 0;
    toll = toll + other;
    sumOfAll = parseFloat(handleTotalCost.jobprice) + parseFloat(handelFule) + parseFloat(toll);

    sumOfAll = (sumOfAll).toFixed(2);
    setTotalAmount(sumOfAll && isNaN(sumOfAll)?'0.00':sumOfAll);

    const storeData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_SUM, JSON.stringify(sumOfAll));
      } catch (error) {
        alert("please try again");
      }
    };
    storeData();
    handleOtherAmount(quote.amountFour);
    handleOtherToll(quote.amountSecond);
    handleamountThird(quote.amountThird);

  }, [quote, sumOfAll]);


  const handleSavedData = async () => {

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);

    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
    };

    try {
      axios
        .post(URLDRIVER + "GetTempPayData", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.status >= 0) {
            const res = response.data;
            console.log("Inside response data ", { res });
            setotherFreeze(res.otherFreeze);
            setQuote({
              amountFirst: res.otherAmt.toString(),
              amountSecond: res.toll.toString(),
              amountThird: res.otherName.toString(),
              amountFour: res.otherAmt.toString(),
            });
          }
        })
        .catch((error) => {
          console.log("API error handleSavedData.", error);
          handleSavedData();
        })
        .finally(function () {
          console.log('Finally Call');
        });
    } catch (error) {
      console.log('api error at handleSavedData..', error);
      handleSavedData();
    }
  };

  console.log("000000000000000000000000000000000000000000000000000", otherFreeze)



  const handleAmountForm = (e, type) => {
    const value = e.nativeEvent.text;
    const data = {
      amountFirst: quote.amountFirst.toString(),
      amountSecond: quote.amountSecond.toString(),
      amountThird: quote.amountThird.toString(),
      amountFour: quote.amountFour.toString(),
    };
    if (type == "amountFirst") {
      data.amountFirst = value;
    }
    if (type == "amountSecond") {
      data.amountSecond = value;
    }
    if (type == "amountThird") {
      data.amountThird = value;
    }
    if (type == "amountFour") {
      data.amountFour = value;
    }

    setQuote(data);
    handleAllData(data);
  };


  console.log("hhhhhhhhhhhhhhhhh",quote.amountFour);
  return (
    <Block>
      <Block style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.item}>
            <Text
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              style={styles.ListTitleLeftNew}
              // color={theme.COLORS.SECONDARY}
            >
              Amount
            </Text>
            <Text
              // style={{ fontFamily: "montserrat-regular" }}
              style={styles.ListTitleRightNew}
              // color={theme.COLORS.SECONDARY}
            >
              <FontAwesome
                size={25}
                style={styles.FontAwesome}
                // color={theme.COLORS.ICON}
                name="dollar"
                family="NowExtra"
              />{" "}
              {handleTotalCost.jobprice}
            </Text>
          </View>
          <View style={styles.item}>
            <Text
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              style={styles.ListTitleLeftNew}
              // color={theme.COLORS.SECONDARY}
            >
              Fuel Charges
            </Text>
            <Text
              // style={{ fontFamily: "montserrat-regular" }}
              style={styles.ListTitleRightNew}
              // color={theme.COLORS.SECONDARY}
            >
              <FontAwesome
                size={25}
                style={styles.FontAwesome}
                // color={theme.COLORS.ICON}
                name="dollar"
                family="NowExtra"
              />{" "}
              {handelFule}
            </Text>
          </View>
        </View>

        <Block row>
          <Block style={styles.wi50}>
            <Text
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              style={styles.label}
            >
              Toll
            </Text>
          </Block>
          <Block style={styles.wi50}>
            <Input
              style={styles.textBox}
              editable={handelPaymentMode == '3' ? false : true}
              type="number-pad"
              placeholder={quote.amountSecond}
              placeholderTextColor={"#8898AA"}
              name="amountSecond"
              // value={quote.amountSecond}
              onChange={(e) => handleAmountForm(e, "amountSecond")}
              shadowless
              iconContent={
                <FontAwesome
                  size={12}
                  style={styles.FontAwesome}
                  // color={theme.COLORS.ICON}
                  name="dollar"
                  family="NowExtra"
                />
              }
            />
          </Block>
        </Block>

        <Block row style={{ marginTop: -10 }}>
          <Block style={styles.wi50}>
            <Input
              style={styles.textBoxLeft}
              placeholder="Other (Type Here)"
              placeholderTextColor={"#8898AA"}
              name="amountThird"
              editable={handelPaymentMode == '3' ? false : true}
              value={quote.amountThird}
              onChange={(e) => handleAmountForm(e, "amountThird")}
              shadowless
            />
          </Block>
          <Block style={styles.wi50}>
            {otherFreeze == '0' ?
              <Input
                style={styles.textBox}
                placeholder={quote.amountFour}
                type="number-pad"
                editable={handelPaymentMode == '3' ? false : true}
                name="amountFour"
                // value={quote.amountFour}
                onChange={(e) => handleAmountForm(e, "amountFour")}
                placeholderTextColor={"#8898AA"}
                shadowless
                iconContent={
                  <FontAwesome
                    size={12}
                    style={styles.FontAwesome}
                    // color={theme.COLORS.ICON}
                    name="dollar"
                    family="NowExtra"
                  />
                }
              /> :
              <Input
                style={styles.textBox}
                placeholder="Amount"
                type="number-pad"
                editable={otherFreeze == '1' ? false : true}
                name="amountFour"
                value={quote.amountFour}
                onChange={(e) => handleAmountForm(e, "amountFour")}
                placeholderTextColor={"#8898AA"}
                shadowless
                iconContent={
                  <FontAwesome
                    size={12}
                    style={styles.FontAwesome}
                    // color={theme.COLORS.ICON}
                    name="dollar"
                    family="NowExtra"
                  />
                }
              />
            }
          </Block>
        </Block>

        <Block row>
          <Block flex right>
            <Text
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              style={styles.ListTitleLeft2}
              // color={theme.COLORS.SECONDARY}
            >
              Total Amount -{" "}
              <Text style={styles.totalAmount}>
                $ {totalAmount}
              </Text>
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container:{
    padding:10
  },
  cardContainer: {
    borderWidth: 0,
    shadowColor: "#8898AA",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.9,
    elevation: 20,
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  newfuel: {
    opacity: 10,
  },
  Customerdetails: {
    backgroundColor: "#000",
    padding: 10,
    position: "relative",
    zIndex: 1000,
  },
  CustomerdetailList: {
    padding: 15,
    lineHeight: 30,
  },
  FuelStyle: {
    borderColor: "#A8A8A8",
    borderWidth: 1,
    height: 41,
    width: 160,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    marginTop: 7,
  },
  ListTitleRight: {
    color: "#000",
    fontStyle: "italic",
    marginBottom: -5,
    backgroundColor: "#f9f9f9",
  },
  ListTitleRightNew: {
    color: "#111",
    borderWidth: 0,
    backgroundColor: "#F9F9F9",
    fontSize: 30,
  },
  ListTitleLeftNew: {
    color: "#000",
    paddingBottom: 0,
    width: 150,
    textAlign: "left",
  },
  ListTitleLeft2: {
    color: "#000",
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  ListTitleRight2: {
    color: "#000",
    paddingBottom: 5,
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  wi50: {
    width: "50%",
    paddingLeft: 5,
  },
  FontAwesome: {
    marginRight: 5,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    flex: 0.5,
    backgroundColor: "#F9F9F9",
    borderTopColor: "#999",
    borderTopWidth: 5,
    margin: 5,
    borderColor: "#000",
    borderRadius: 5,
    padding: 5,
  },
  itemNew: {
    flex: 0.5,
    backgroundColor: "#F9F9F9",
    margin: 5,
  },
  textBox: {
    borderWidth: 0,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    height: 40,
  },
  textBoxLeft: {
    borderWidth: 0,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    height: 40,
    paddingLeft: 0,
  },
  label: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    height: 48,
    paddingTop: 18,
    color:"#8898AA"
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default PaymentDetail;
