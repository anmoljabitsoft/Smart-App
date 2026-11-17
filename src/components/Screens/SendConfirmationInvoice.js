import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Dimensions, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Input, Text, theme } from "galio-framework";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";

import {
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URL,
  URLEMAIL,
  WAIVERFROM,
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const SendConfirmationPage = ({ navigation, route, style }) => {
  const [quote, setQuote] = React.useState({
    name: "",
    email: "",
  });
  const [userName, setUserName] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [jobIds, setJobIds] = useState();
  const [showSpinner, setshowSpinner] = useState(false);
  const jobid = route.params;

  console.log("44444444444444444444444444444444444444444444", quote)

  useEffect(() => {
    const handleJobData = async () => {
      try {
        const values = await AsyncStorage.getItem(STORAGE_JOBID);
        if (values !== null) {
          setJobIds(JSON.parse(values));
        }
      } catch (error) {
        alert("please try again 3");
      }
    };
    handleJobData();
  }, []);

  const handleUserDetails = (e, type) => {
    const value = e.nativeEvent.text;
    const data = {
      name: quote.name,
      email: quote.email,
    };
    if (type == 1) {
      data.name = value;
    } else if (type == 2) {
      data.email = value;
    }
    setQuote(data);
  };

  useEffect(() => {
    setUserName(quote.name);
    setUserEmail(quote.email);
  }, [quote]);

  const handleSentNameAndEmail = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    const emailValidation = new RegExp(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
    ).test(UserEmail);

    if (userName == "") {
      alert("Please fill name");
    } else if (UserEmail == "") {
      alert("Please fill email");
    } else if (emailValidation == false) {
      alert("Invalid Email Id");
    } else {
      const json = {
        DriverId: driverid,
        JobId: JSON.parse(jobid),
        Customer_Name: userName && userName,
        Customer_Mobile: "-",
        Customer_Address: "-",
        Email: UserEmail,
        EmailText: "-",
        note: "-",
      };

      console.log("Payload::EMAIL",json);
      console.log("EMAIL URL",URLEMAIL + "SendConfirmationEmail");


      try {
        setshowSpinner(true);
        axios
          .post(URLEMAIL + "SendConfirmationEmail", json, {
            headers: {
              Authorization:
                "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.status == 200) {
              setshowSpinner(false);
              navigation.navigate("Success");
            }
          })
          .catch((error) => {
            console.log("API error", error);
            setshowSpinner(false);
          })
          .finally(function () {
            setshowSpinner(false);
          });
      } catch (error) {
        setshowSpinner(false);
      }
    }
  };

  const waiverData = async () => {
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      JobId: JSON.parse(jobid),
    };

    try {
      setshowSpinner(true);
      axios
        .post(WAIVERFROM + "AutoFillWaiver", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then(async (response) => {
          console.log("####################################3", response.data);
          setQuote({ name: response.data.name, email: response.data.email });
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(false);

        })
        .finally(function () {
          console.log("finally");
          setshowSpinner(false);

        });
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
    }
  };

  useEffect(() => {
    waiverData();
  }, []);

  const handleRedirect = (id) => {
    if (id == 1) {
      navigation.navigate("Success");
    }
  };

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
            Confirmation
          </Text>
        </Block>
      </Block>
      <Block style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          <Block style={styles.topblock}>
            <Block center>
              <Text
                size={16}
                style={styles.SecondTextBox}
                color={theme.COLORS.SECONDARY}
              >
                Payment Receipt for
              </Text>
              <Text
                size={16}
                style={styles.FirstTextBox}
                color={theme.COLORS.SECONDARY}
              >
                Job {jobid !== undefined ? jobid.paramKey : jobIds}
              </Text>
            </Block>
          </Block>
          <Block>
            <Block>
              <Text
                style={{ fontFamily: "montserrat-regular" }}
                size={16}
                // style={styles.Text}
                color={theme.COLORS.SECONDARY}
              >
                Enter Name
              </Text>
            </Block>

            <Block>
              <Block flex right style={styles.wi50}>
                {/* <Input
                  style={styles.ListTitleRight}
                  placeholder="Enter Your Name"
                  placeholderTextColor={"#8898AA"}
                  name="name"
                  value={quote.name}
                  onChange={(e) => handleUserDetails(e, 1)}
                  shadowless
                  iconContent={
                    <FontAwesome
                      size={12}
                      style={styles.FontAwesome}
                      color={theme.COLORS.ICON}
                      name="user"
                      family="NowExtra"
                    />
                  }
                /> */}

                <Input
                  
                  style={styles.ListTitleRight}
                  value={quote.name}
                  placeholder="Enter Your Name"
                  placeholderTextColor={"#8898AA"}
                  onChange={(e) => handleUserDetails(e, 1)}
                  name="name"
                  shadowless
                  iconContent={
                    <FontAwesome
                      size={12}
                      style={styles.FontAwesome}
                      color={theme.COLORS.ICON}
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
                color={theme.COLORS.SECONDARY}
              >
                Email
              </Text>
            </Block>

            <Block>
              <Input
                type="email-address"
                style={styles.ListTitleRight}
                value={quote.email}
                placeholder="Enter Your Email Id"
                placeholderTextColor={"#8898AA"}
                onChange={(e) => handleUserDetails(e, 2)}
                name="email"
                shadowless
                iconContent={
                  <FontAwesome
                    size={12}
                    style={styles.FontAwesome}
                    color={theme.COLORS.ICON}
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
            Send Receipt
          </Button>
        </Block>
        <Block style={styles.Skip}>
          <Block center>
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
              small
              center
              color="success"
              onPress={() => {
                handleRedirect(1);
              }}
              style={styles.optionsButtonSkip}
            >
              Skip
            </Button>
          </Block>
        </Block>
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
    paddingTop: 50,
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
  optionsButtonSkip: {
    backgroundColor: "#000",
    borderRadius: 10,
    color: "#000",
    width: 50,
    height: 30,
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
  icons: {
    marginRight: -20,
    fontSize: 30,
  },
});

export default SendConfirmationPage;
