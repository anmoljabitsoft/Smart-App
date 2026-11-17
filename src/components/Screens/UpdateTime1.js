import React, { useEffect, useState } from "react";

import axios from 'axios';

import {
  Dimensions, StyleSheet, ScrollView,
  BackHandler,
} from "react-native";

import { Block, Button, Input, Text, theme } from "galio-framework";

import AsyncStorage from '@react-native-async-storage/async-storage';

import SelectDropdown from "react-native-select-dropdown";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { OverlaySpinner } from "../../utils/Spinner";

import { URLDRIVER, STORAGE_DRIVERID } from "../../utils/factory";

import { useFocusEffect } from "@react-navigation/native";

// import CountDown from 'react-native-countdown-component';

const { height, width } = Dimensions.get("window");

var timeZone = [
  {
    time: "Select Time",
    value: 0,
  },
  {
    time: "0:30 Hour",
    value: 30,
  },
  {
    time: "1:00 Hour",
    value: 60,
  },
  {
    time: "1:30 Hour",
    value: 90,
  },
  {
    time: "2:00 Hour",
    value: 120,
  },
  {
    time: "2:30 Hour",
    value: 150,
  },
  {
    time: "3:00 Hour",
    value: 180,
  },
  {
    time: "3:30 Hour",
    value: 210,
  },
  {
    time: "4:00 Hour",
    value: 240,
  },
  {
    time: "4:30 Hour",
    value: 270,
  },
  {
    time: "5:00 Hour",
    value: 300,
  },
];

const UpdateTime = ({ navigation }) => {

  const [quoteDealerFilter, setQuoteDealerFilter] = useState([]);


  const [selectedJob, setSelectedJob] = useState(0);

  const [selectedTime, setSelectedTime] = useState(0);

  const [availableTime, setavailableTime] = useState();

  const [showSpinner, setshowSpinner] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleSentNameAndEmail();
    });
    return unsubscribe;
  }, [navigation]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       return true;
  //     };

  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () => {
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //     };
  //   }, [])
  // );

  const handleSentNameAndEmail = async () => {

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);

    setavailableTime();

    const json = {
      DriverId: driverid,
    };

    let map = [];

    try {
      setshowSpinner(true);
      axios
        .post(URLDRIVER + "DriverJobsSelect", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setshowSpinner(false);
          const responseData = response.data;
          if (responseData) {
            map.push({ label: "please select", value: "Select Job" });
            responseData.forEach((item) => {
              map.push({ label: item.destaddress, value: item.jobid });
            });
            setQuoteDealerFilter(map);
            setavailableTime(responseData[0].availtime);
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
      console.log(error);
    }
  };

  const handleTimeUpdate = async () => {

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);

    if (selectedJob == 0) {
      alert("Please Select Job");
    } else if (selectedTime == 0) {
      alert("Please Select Time");
    } else {
      var json = {
        DriverId: driverid.toString(),
        JobId: selectedJob.toString(),
        FreeTime: selectedTime.toString(),
      };


      try {
        setshowSpinner(true);

        axios
          .post(URLDRIVER + "DriverTimeUpdate", json, {
            headers: {
              Authorization:
                "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("response data from back end", response)
            alert("Time updated successfully");
            setQuoteDealerFilter([]);
            setshowSpinner(false);
            handleSentNameAndEmail();
          })
          .catch((error) => {
            console.log("API error", error);
            setshowSpinner(false);
          })
          .finally(function () {
            setshowSpinner(false);
          });
      } catch (error) {
        console.log(error);
        setshowSpinner(false);
      }
    }

  };

  return (
    <Block style={styles.container}>
      {showSpinner && <OverlaySpinner />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block style={styles.SectionOne}>
          <Block flex center>
            <Text
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // style={styles.Text}
              color={theme.COLORS.SECONDARY}
            >
              I will be available in
            </Text>
          </Block>

          <Block>
            {availableTime && availableTime.length > 0 &&
              <Block flex center style={styles.wi50}>
                {/* <CountDown
                  size={25}
                  until={availableTime}
                  // onFinish={() => alert('Finished')}
                  digitStyle={{ backgroundColor: '#FFF' }}
                  digitTxtStyle={{ color: '#000', marginRight: 0 }}
                  timeLabelStyle={{ color: '#000', fontWeight: 'bold' }}
                  separatorStyle={{ color: '#000' }}
                  timeToShow={['H', 'M', 'S']}
                  timeLabels={{ m: null, s: null }}
                  showSeparator
                /> */}
              </Block>
            }
          </Block>
        </Block>

        <Block style={styles.SectionOne}>
          <Block>
            <Text

              style={{ fontFamily: "montserrat-regular" }}
              size={16}

              // style={styles.Text}
              color={theme.COLORS.SECONDARY}
            >
              Select Job
            </Text>
          </Block>

          <Block>
            <Block flex right style={styles.wi50}>
              <SelectDropdown
                data={quoteDealerFilter}
                onSelect={(selectedItem, index) => {
                  setSelectedJob(selectedItem.value);
                }}
                defaultButtonText={"Select job"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label;
                }}
                rowTextForSelection={(item, index) => {
                  return item.label;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#444"}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
              />
            </Block>
          </Block>
        </Block>

        <Block style={styles.SectionOne}>
          <Block>
            <Text
              style={{ fontFamily: "montserrat-regular" }}
              size={16}
              // style={styles.Text}
              color={theme.COLORS.SECONDARY}
            >
              Set Time
            </Text>
          </Block>

          <Block>
            <SelectDropdown
              data={timeZone}
              onSelect={(selectedItem, index) => {
                setSelectedTime(selectedItem.value);
              }}
              defaultButtonText={"Select Hours"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.time;
              }}
              rowTextForSelection={(item, index) => {
                return item.time;
              }}
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <FontAwesome
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
            />
          </Block>
        </Block>
      </ScrollView >
      <Block middle style={styles.JobButton}>
        <Button
          textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
          small
          round
          center
          onPress={handleTimeUpdate}
          color="success"
          style={styles.optionsButtonStart}
        >
          UPDATE
        </Button>
      </Block>
    </Block >
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
    height: height,
  },
  Text: {
    color: "#000",
    paddingBottom: 10,
  },
  headText: {
    fontSize: 22,
    fontWeight: "bold"
  },
  TextTwo: {
    color: "#000",
    paddingBottom: 10,
  },
  dropDownBrand: {
    paddingRight: 190,
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
    backgroundColor: "#fff",
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
    paddingBottom: 330,
  },
  optionsButtonStart: {
    backgroundColor: "#5fd27f",
    width: width/1.08,
    height: 40,
    marginHorizontal: 5,
    elevation: 0,
    borderRadius:5
  },
  optionsButtonFinish: {
    backgroundColor: "#246afd",
    borderRadius: 10,
  },
  Skip: {
    marginBottom: 170,
    marginTop: 15,
  },
  ListTitleRight: {
    paddingRight: 120,
  },
  FontAwesome: {
    marginRight: 10,
  },
  FirstTextBox: {
    fontFamily: "montserrat-regular",
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 11 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: { backgroundColor: "#FFF", borderBottomColor: "#C5C5C5" },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 11 },
});

export default UpdateTime;
