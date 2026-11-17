import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Dimensions, StyleSheet, ScrollView, BackHandler } from "react-native";
// galio component
import { Block, Button, Input, NavBar, Text, theme } from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_JOBID,
  STORAGE_SIGNATURE,
  STORAGE_SIGN,
} from "../../utils/factory";
import { useFocusEffect } from "@react-navigation/native";
import SafeAreaWrapper from "../SafeAreaWrapper";
const { height, width } = Dimensions.get("window");

const SuccessScreen = ({ navigation, route, style }) => {
  const [jobIds, setJobIds] = useState();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // navigation.navigate("ThirdPage");
  //       // Return true to stop default back navigaton
  //       // Return false to keep default back navigaton
  //       return true;
  //     };

  //     // Add Event Listener for hardwareBackPress
  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () => {
  //       // Once the Screen gets blur Remove Event Listener
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //     };
  //   }, [])
  // );

  useEffect(() => {
    const handleJobData = async () => {
      try {
        const values = await AsyncStorage.getItem(STORAGE_JOBID);
        if (values !== null) {
          // We have data!!
          setJobIds(JSON.parse(values));
        }
      } catch (error) {
        alert("please try again");
      }
    };
    handleJobData();
  }, []);

  // const handleRedirectSecond = (id) => {
  //   if (id == 1) {
  //     navigation.navigate("Dashboard");
  //   }
  // };

  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.removeItem(STORAGE_SIGNATURE);
      AsyncStorage.removeItem(STORAGE_SIGN);
      navigation.navigate("MyJobListPage");
    }, 6000);
  }, []);

  const handleRedirectJobList = (id) => {
    if (id == 2) {
      AsyncStorage.removeItem(STORAGE_SIGNATURE);
      AsyncStorage.removeItem(STORAGE_SIGN);
      navigation.navigate("MyJobListPage");
    }
  };

  return (
    <SafeAreaWrapper>
    <Block style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block style={styles.MiddleContainer}>
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
                <Block left>
                  <Button
                    round
                    onlyIcon
                    icon="check"
                    iconFamily="Font-Awesome"
                    iconColor="#3B951E"
                    iconSize={theme.SIZES.BASE * 1.5}
                    color={"#fff"}
                  />
                </Block>
              </Text>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                // style={{ fontFamily: "montserrat-regular" }}
                size={16}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                style={styles.Text1}
                color={theme.COLORS.SECONDARY}
              >
                <Text style={styles.Text2}>Job No. {jobIds}</Text>
              </Text>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                // style={{ fontFamily: "montserrat-regular" }}
                size={16}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                style={styles.Text1}
                color={theme.COLORS.SECONDARY}
              >
                You have Successfully completed your job.
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
              onPress={() => {
                handleRedirectJobList(2);
              }}
            >
              Go To Job List
            </Button>
            {/* <Text> OR </Text>
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
              small
              center
              color="success"
              style={styles.optionsButtonStart}
              onPress={() => {
                handleRedirectSecond(1);
              }}
            >
              Go To DashBoard
            </Button> */}
          </Block>
        </Block>
      </ScrollView>
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
  MiddleContainer: {
    marginTop: 130,
    textAlign: "center",
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "#DADADA",
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
    marginTop: 0,
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
    marginBottom: 15,
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

export default SuccessScreen;
