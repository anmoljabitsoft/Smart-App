import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// galio component
import { Block, Input, Text, theme } from "galio-framework";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { URLPAYMENT, STORAGE_SUM } from "../../utils/factory";

const MixPaymentDetail = ({
  handleAllData,
  handleAllTotal,
  handleCardAndPercentagesAmount,
}) => {
  const [quote, setQuote] = React.useState({
    cash: 0,
    invoice: 0,
    online: 0,
  });
  const [total, setTotal] = useState();
  const [ccPer, setCcPer] = useState("");
  const [ccAmount, setCcAmount] = useState(0);

  const handleAmountForm = (e, type) => {
    const value = e.nativeEvent.text;
    const data = {
      cash: quote.cash.toString(),
      invoice: quote.invoice.toString(),
      online: quote.online.toString(),
    };
    if (type == "cash") {
      data.cash = value;
    }

    if (type == "invoice") {
      data.invoice = value;
    }
    if (type == "online") {
      data.online = value;
    }

    setQuote(data);
    handleAllData(data);
  };

  const handlePercentageOnMix = async () => {
    const json = {
      JobPrice: JSON.parse(total),
    };

    // console.log("22222222222222222222222222222222222222222222222222")

    try {
       const paymentURL=`${URLPAYMENT}GetCCCharges`
      axios
        .post(paymentURL, json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // const responseData = JSON.parse(response?.data);
          // setCcPer(responseData.CCPer);

          if(response && response?.data?.ret){
            const responseData = JSON.parse(response?.data?.ret);
            setCcPer(responseData?.CCPer);
          }
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

  useEffect(() => {
    let total = 0.00;
    let ccAmount = 0.00;
    let cardAmount = 0.00;
    total =
      parseFloat(quote.cash) + parseFloat(quote.online);
    handleAllTotal(total);

    if (quote.online != "" && parseFloat(quote.online) > 0) {
      ccAmount = (parseFloat(quote.online) * parseFloat(ccPer)) / 100;


      cardAmount = parseFloat(quote.online) + parseFloat(ccAmount);
      cardAmount = parseFloat(cardAmount).toFixed(2)

      handleCardAndPercentagesAmount(cardAmount);
      setCcAmount(ccAmount);
    } else {
      ccAmount = 0;
      setCcAmount(ccAmount);
    }
  }, [quote]);

  useEffect(() => {
    handlePercentageOnMix();
  }, [total]);

  return (
    <Block>
      <Block style={styles.SectionOne}>
        <Block row>
          <Block middle row style={styles.wi50}>
            <MaterialCommunityIcons
              size={30}
              style={{ marginRight: 5, marginLeft: 20 }}
              color="#848484"
              name="cash"
              family="NowExtra"
            />
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={[styles.ListTitleLeft,{ fontFamily: "montserrat-regular" }]}
              color={theme.COLORS.SECONDARY}
            >
              Cash
            </Text>
          </Block>

          <Block flex right style={styles.wi50}>
            <Input
              style={styles.ListTitleRight}
              placeholder="Amount"
              placeholderTextColor={"#8898AA"}
              shadowless
              keyboardType="numeric"
              name="cash"
              onChange={(e) => handleAmountForm(e, "cash")}
              // iconContent={
              //   <FontAwesome
              //     size={12}
              //     style={styles.FontAwesome}
              //     color={theme.COLORS.ICON}
              //     name="dollar"
              //     family="NowExtra"
              //   />
              // }
              icon={
                <Block>
                  <FontAwesome
                   name="dollar" size={12} color="#000"
                    // style={styles.FontAwesome}
                  />
                </Block>
              }
            />
          </Block>
        </Block>

        <Block row>
          <Block middle row style={styles.wi50}>
            <MaterialCommunityIcons
              size={28}
              style={{ marginRight: 10, marginLeft: 20 }}
              color="#848484"
              name="card-bulleted"
              family="NowExtra"
            />
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.ListTitleLeft,{ fontFamily: "montserrat-regular" }]}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Card
            </Text>
          </Block>

          <Block flex right style={styles.wi50}>
            <Input
              style={styles.ListTitleRight}
              placeholder="Amount"
              placeholderTextColor={"#8898AA"}
              keyboardType="numeric"
              shadowless
              name="online"
              onChange={(e) => handleAmountForm(e, "online")}
              iconContent={
                <FontAwesome
                  size={12}
                  style={styles.FontAwesome}
                  color={theme.COLORS.ICON}
                  name="dollar"
                  family="NowExtra"
                />
              }
            />
          </Block>
        </Block>

        <Block flex style={{ marginTop: 10 }}>
          <Text
            style={{ fontFamily: "montserrat-regular", textAlign: "center" }}
            size={14}
            color={theme.COLORS.SECONDARY}
          >
            <Text>
              {" "}
              {ccPer || 0}
              {"%"}
            </Text>{" "}
            credit card charges will be applicable
          </Text>
        </Block>

        {quote.online.length > 0 && (
          <Block flex>
            <Text
              style={{ fontFamily: "montserrat-regular", textAlign: "center" }}
              size={14}
              color={theme.COLORS.SECONDARY}
            >
              <Text>
                Credit card charges extra{" "}
                <FontAwesome
                  size={12}
                  style={styles.FontAwesome}
                  name="dollar"
                  family="NowExtra"
                />{" "}
                <Text style={{ fontWeight: "bold", color: "#505050" }}>
                  {ccAmount.toFixed(2)}
                </Text>
              </Text>
            </Text>
          </Block>
        )}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  SectionOne: {
    padding: 10,
    borderColor: "#f1f1f1",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
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
  Customerdetails: {
    backgroundColor: "#000",
    padding: 10,
    height: 40,
    borderRadius: 10,
  },
  CustomerdetailList: {
    padding: 15,
    lineHeight: 30,
  },
  ListTitleLeft: {
    color: "#848484",
    paddingBottom: 0,
    width: 150,
  },
  ListTitleRight: {
    color: "#000",
    fontStyle: "italic",
    marginBottom: -5,
    backgroundColor: "#f9f9f9",
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
    color: "#505050",
  },
});

export default MixPaymentDetail;
