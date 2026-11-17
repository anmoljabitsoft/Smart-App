import React, { useEffect, useState } from "react";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  // TouchableWithoutFeedback,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// galio component
import {
  Block,
  Button,
  Input,
  NavBar,
  Checkbox,
  Text,
  theme,
  Radio,
} from "galio-framework";
import {
  STORAGE_KEY,
  URL,
  clearLocalStorage,
  STORAGE_INTRO,
} from "../../utils/factory";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
const { height, width } = Dimensions.get("window");
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { RadioButton } from "react-native-paper";

const PaymentMethod = ({ handleCheckedType, handelPaymentMode }) => {
  const [checked, setChecked] = React.useState("");
  console.log("dddddddddadsdw",{handleCheckedType, handelPaymentMode});
  const handleClicked = (type) => {
    setChecked(type);
    if (type == "first") {
      handleCheckedType(1);
    } else if (type == "second") {
      handleCheckedType(2);
    } else if (type == "three") {
      handleCheckedType(3);
    } else if (type == "four") {
      handleCheckedType(4);
    }
  };
  return (
    <Block style={styles.cardContainer}>
      {handelPaymentMode == 3 ? (
        <Block row style={styles.PaymenySection}>
          <Block>
            {/* <Radio
              name="choice"
              checkboxStyle={{
                borderWidth: 1,
                borderRadius: 2,
                borderColor: "#E3E3E3",
              }}
              color={theme.COLORS.PRIMARY}
              labelStyle={{
                color: theme.COLORS.HEADER,
                fontFamily: "montserrat-regular",
              }}
              onChange={() => handleClicked("4")}
            /> */}
            <RadioButton
              value="four"
              status={checked === "four" ? "checked" : "unchecked"}
              onPress={() => handleClicked("four")}
            />
          </Block>

          <Block middle row>
            <FontAwesome5
              size={15}
              style={{ marginRight: 10, marginLeft: 20 }}
              color={theme.COLORS.ICON}
              name="file-invoice-dollar"
              family="NowExtra"
            />
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              // style={styles.ListTitleRight}
              // color={theme.COLORS.SECONDARY}
              onPress={() => handleClicked("four")}

            >
              Invoice
            </Text>
          </Block>
        </Block>
      ) : (
        <>
          <Block row>
            <Block flex>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ fontFamily: "montserrat-regular" }}
                size={14}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                // style={styles.cardTitle}
                color="black"
              >
                Select Payment Method
              </Text>
            </Block>
          </Block>
          <Block style={styles.CustomerdetailList}>
            <Block row style={styles.PaymenySection}>
              <Block>
                {/* <Radio
                  name="choice"
                  checkboxStyle={{
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: "#E3E3E3",
                  }}
                  color={theme.COLORS.PRIMARY}
                  labelStyle={{
                    color: theme.COLORS.HEADER,
                    fontFamily: "montserrat-regular",
                  }}
                  onChange={() => handleClicked("1")}
                  disabled={one}
                /> */}

                <RadioButton
                  value="first"
                  status={checked === "first" ? "checked" : "unchecked"}
                  onPress={() => handleClicked("first")}
                />
              </Block>

              <Block middle row>
                <FontAwesome
                  size={15}
                  style={{ marginRight: 10, marginLeft: 20 }}
                  color={theme.COLORS.ICON}
                  name="money"
                  family="NowExtra"
                />
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ fontFamily: "montserrat-regular" }}
                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // style={styles.ListTitleRight}
                  // color={theme.COLORS.SECONDARY}
                  onPress={() => handleClicked("first")}
                >
                  Cash
                </Text>
              </Block>
            </Block>
            <Block row style={styles.PaymenySection}>
              <Block>
                {/* <Radio
                  name="choice"
                  checkboxStyle={{
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: "#E3E3E3",
                  }}
                  color={theme.COLORS.PRIMARY}
                  labelStyle={{
                    color: theme.COLORS.HEADER,
                    fontFamily: "montserrat-regular",
                  }}
                  onChange={() => handleClicked("2")}
                  disabled={two}
                /> */}
                <RadioButton
                  value="second"
                  status={checked === "second" ? "checked" : "unchecked"}
                  onPress={() => handleClicked("second")}
                />
              </Block>

              <Block middle row>
                <Entypo
                  size={15}
                  style={{ marginRight: 10, marginLeft: 20 }}
                  color={theme.COLORS.ICON}
                  name="credit-card"
                  family="NowExtra"
                />
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ fontFamily: "montserrat-regular" }}
                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // style={styles.ListTitleRight}
                  // color={theme.COLORS.SECONDARY}
                  onPress={() => handleClicked("second")}

                >
                  Card Payment
                </Text>
              </Block>
            </Block>
            <Block row style={styles.PaymenySection}>
              <Block>
                {/* <Radio
                  name="choice"
                  checkboxStyle={{
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: "#E3E3E3",
                  }}
                  color={theme.COLORS.PRIMARY}
                  labelStyle={{
                    color: theme.COLORS.HEADER,
                    fontFamily: "montserrat-regular",
                  }}
                  onChange={() => handleClicked("3")}
                  disabled={three}
                /> */}
                <RadioButton
                  value="second"
                  status={checked === "three" ? "checked" : "unchecked"}
                  onPress={() => handleClicked("three")}
                />
              </Block>

              <Block middle row>
                <MaterialIcons
                  size={15}
                  style={{ marginRight: 10, marginLeft: 20 }}
                  color={theme.COLORS.ICON}
                  name="payments"
                  family="NowExtra"
                />
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ fontFamily: "montserrat-regular" }}
                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // style={styles.ListTitleRight}
                  // color={theme.COLORS.SECONDARY}
                  onPress={() => handleClicked("three")}

                >
                  Cash & Card Both
                </Text>
              </Block>
            </Block>
          </Block>
        </>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 50,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: "#F9F9F9",
    borderRadius: 5,
    margin: 4,
    paddingLeft: 8
  },
  Customerdetails: {
    backgroundColor: "#000",
    padding: 10,
    height: 40,
    borderRadius: 10,
  },
  CustomerdetailList: {
    marginTop: 15,
    lineHeight: 30,
    marginBottom: 10
  },
  ListTitleLeft: {
    color: "#000",
    paddingBottom: 5,
  },
  ListTitleRight: {
    color: "#000",
    // fontStyle: "italic",
    textAlign: "left",
    fontSize: 17,
  },
  PaymenySection: {
    borderColor: "#f1f1f1",
    paddingBottom: 0,
  },
  cardTitle: {
    marginBottom: -10,
    marginTop: 10,
    textAlign: "left",
    marginLeft: 10
  }
});

export default PaymentMethod;
