import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Dimensions, StyleSheet, ScrollView, View, TouchableOpacity, BackHandler } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text, theme, Button } from "galio-framework";
import { URL, STORAGE_DRIVERID, STORAGE_JOBID } from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import AntDesign from "react-native-vector-icons/AntDesign";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");
const FinishJobDetail = ({ navigation, route, style }) => {
  const [showSpinner, setshowSpinner] = useState(false);
  const [issueLists, setIssueLists] = useState("");
  // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@121323', issueLists && issueLists.jobId);

  // Handle Job Finish Details
  const handleJobFinishedDetails = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
    };
    console.log("PL",json);
    try {
      const baseURL=`${URL}GetFinishJobDetails`
      console.log("URL_JOBFINISH",baseURL);
      setshowSpinner(true);
      axios
        .post(baseURL, json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setshowSpinner(false);
          const responseData = response?.data;
          if (responseData) {
            setIssueLists(responseData);
          }
        })
        .catch((error) => {
          console.log("API error Inside Edit", error);
          setshowSpinner(true);
          handleJobFinishedDetails();
        })
        .finally(function () { });
    } catch (error) {
      console.log(error);
      setshowSpinner(true);
      handleJobFinishedDetails();
    }
  };

  const handleRedirectConfirmationPage = async (data) => {
    navigation.navigate("SendCashConfirmation", {
      paramKey: data && data,
    });
  };

  useEffect(() => {
    handleJobFinishedDetails();
  }, []);

  useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('MyJobs');
          return true; // Prevent default back behavior
        }
      );
  
      return () => backHandler.remove();
    }, [navigation]);

  return (
    <SafeAreaWrapper>
    <Block flex>
      {showSpinner && <OverlaySpinner />}

    
       {/* Header */}
            <Block row style={styles.header}>
              <TouchableOpacity 
                onPress={() => {
                  navigation.navigate("MyJobs");
                }}
                style={styles.backButton}
              >
                <AntDesign name="arrowleft" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}>Finished Job Details</Text>
              
      
            </Block>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block style={styles.container}>
          <Block style={styles.cardContainerOne}>
            <Block flex style={styles.CustomerdetailsOne}>
              <Block flex>
                <Text
                  size={14}
                  style={styles.cardTitle}
                  color={theme.COLORS.SECONDARY}
                >
                  Job ID : {issueLists.jobid}
                </Text>
              </Block>

              <Block style={styles.subDiv}>
                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      color={theme.COLORS.SECONDARY}
                    >
                      Customer Name
                    </Text>
                  </Block>

                  <Block flex>
                    <Text

                      size={14}

                      style={styles.notes}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.customerName}
                      {/* Driver Notes by Customer Data */}
                    </Text>
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      color={theme.COLORS.SECONDARY}
                    >
                      Customer Mobile
                    </Text>
                  </Block>

                  <Block flex>
                    <Text
                      size={14}
                      style={styles.notes}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.customerMobile}
                    </Text>
                  </Block>
                </Block>

                <Block style={styles.mainContainer}>
                  <Block style={styles.itemTop}>
                    <Block>
                      <Text
                        size={14}
                        style={styles.ListTitleLeft}
                        color={theme.COLORS.SECONDARY}
                      >
                        Job Date
                      </Text>
                    </Block>

                    <Block flex>
                      <Text
                        size={14}
                        style={styles.notes}
                        color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.jobDate}
                      </Text>
                    </Block>
                  </Block>

                  <Block style={styles.itemTop}>
                    <Block>
                      <Text
                        size={14}
                        style={styles.ListTitleLeft}
                        color={theme.COLORS.SECONDARY}
                      >
                        Payment Mode
                      </Text>
                    </Block>

                    <Block flex>
                      <Text
                        size={14}
                        style={styles.notes}
                        color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.paymentMode}
                      </Text>
                    </Block>
                  </Block>
                </Block>

                <Block style={styles.mainContainer}>
                  <Block style={styles.itemTop}>
                    <Block>
                      <Text
                        size={14}
                        style={styles.ListTitleLeft}
                        color={theme.COLORS.SECONDARY}
                      >
                        Job Type
                      </Text>
                    </Block>

                    <Block flex>
                      <Text
                        size={14}
                        style={styles.notes}
                        color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.jobType}
                      </Text>
                    </Block>
                  </Block>

                  <Block style={styles.itemTop}>
                    <Block>
                      <Text
                        size={14}
                        style={styles.ListTitleLeft}
                        color={theme.COLORS.SECONDARY}
                      >
                        Job Timing
                      </Text>
                    </Block>

                    <Block flex>
                      <Text
                        size={14}
                        style={styles.notes}
                        color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.jobTime}
                      </Text>
                    </Block>
                  </Block>
                </Block>

                <Block style={{ marginTop: 6 }}>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      color={theme.COLORS.SECONDARY}
                    >
                      Driver Notes By Office
                    </Text>
                  </Block>

                  <Block flex>
                    <Text
                      size={14}
                      style={styles.notes}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.drivernoteOffice}

                    </Text>
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      color={theme.COLORS.SECONDARY}
                    >
                      Driver Notes By Customer
                    </Text>
                  </Block>

                  <Block flex>
                    <Text
                      size={14}
                      style={styles.notes}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.drivernoteCust}

                    </Text>
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      color={theme.COLORS.SECONDARY}
                    >
                      Good Summary
                    </Text>
                  </Block>

                  <Block flex>
                    <Text
                      size={14}
                      style={styles.notes}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.goodsSummary}

                    </Text>
                  </Block>
                </Block>

                <Block row style={styles.blockRed}>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Job Timing
                    </Text>
                  </Block>

                  <Block flex right>
                    <Text
                      size={14}
                      style={styles.ListTitleRight}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.jobTime}
                    </Text>
                  </Block>
                </Block>

                {issueLists.isMin == 1 ? (
                  <Block row style={styles.blockAqua}>
                    <Block>
                      <Text
                        size={14}
                        style={styles.ListTitleLeftNew}
                        color={theme.COLORS.SECONDARY}
                      >
                        Minimum Job Time
                      </Text>
                    </Block>

                    <Block flex right>
                      <Text
                        size={14}
                        style={styles.ListTitleRight}
                        color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.minJobTime}
                      </Text>
                    </Block>
                  </Block>
                ) : null}

                <Block row style={styles.blockGreen}>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Travel Timing
                    </Text>
                  </Block>

                  <Block flex right>
                    <Text
                      size={14}
                      style={styles.ListTitleRight}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.travelTime}
                    </Text>
                  </Block>
                </Block>
                <Block row style={styles.blockBlue}>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Total Payable Time
                    </Text>
                  </Block>

                  <Block flex right>
                    <Text
                      size={14}
                      style={styles.ListTitleRight}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.totalPayableTime}
                    </Text>
                  </Block>
                </Block>

                {/* <Block row style={styles.blockBlue}>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Total Paid Amount
                    </Text>
                  </Block>

                  <Block flex right>
                    <Text
                      size={14}
                      style={styles.ListTitleRight}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.totalPayaleTime}
                    </Text>
                  </Block>
                </Block> */}

                <View style={styles.mainContainer}>
                  <View style={styles.item}>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Job Price
                    </Text>
                    <Text
                      style={styles.ListTitleRightNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      <FontAwesome
                        size={25}
                        style={styles.FontAwesome}
                        color={theme.COLORS.ICON}
                        name="dollar"
                        family="NowExtra"
                      />{" "}
                      {issueLists.jobPrice}
                    </Text>
                  </View>
                  <View style={styles.item}>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Fuel Charges
                    </Text>
                    <Text
                      style={styles.ListTitleRightNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      <FontAwesome
                        size={25}
                        style={styles.FontAwesome}
                        color={theme.COLORS.ICON}
                        name="dollar"
                        family="NowExtra"
                      />{" "}
                      {issueLists.fuelPrice}
                    </Text>
                  </View>
                </View>

                <View style={styles.mainContainer}>
                  <View style={styles.item}>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Toll Charges
                    </Text>
                    <Text
                      style={styles.ListTitleRightNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      <FontAwesome
                        size={25}
                        style={styles.FontAwesome}
                        color={theme.COLORS.ICON}
                        name="dollar"
                        family="NowExtra"
                      />{" "}
                      {issueLists.tollPrice}
                    </Text>
                  </View>
                  <View style={styles.item}>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      {issueLists.otherName}
                    </Text>
                    <Text
                      style={styles.ListTitleRightNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      <FontAwesome
                        size={25}
                        style={styles.FontAwesome}
                        color={theme.COLORS.ICON}
                        name="dollar"
                        family="NowExtra"
                      />{" "}
                      {issueLists.otherAmuont || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.mainContainer}>
                  <View style={styles.item}>
                    <Text
                      size={14}
                      style={styles.ListTitleLeftNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      Total Paid Amount
                    </Text>
                    <Text
                      style={styles.ListTitleRightNew}
                      color={theme.COLORS.SECONDARY}
                    >
                      <FontAwesome
                        size={25}
                        style={styles.FontAwesome}
                        color={theme.COLORS.ICON}
                        name="dollar"
                        family="NowExtra"
                      />{" "}
                      {issueLists.totalAmount}
                    </Text>
                  </View>
                </View>
              </Block>
              <Block center>
                <Button
                  textStyle={{ fontFamily: 'montserrat-regular', fontSize: 15 }}
                  onPress={() => { handleRedirectConfirmationPage(issueLists && issueLists.jobid) }}
                  center
                  color="info"
                  style={styles.optionsButtonFinish}>
                  Send Receipt
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </Block>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  cardContainerOne: {
    backgroundColor: "#fff",
    borderWidth: 0,
    shadowColor: "#8898AA",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.9,
    elevation: 20,
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 0,
  },
  header: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: 10,
  },
  avatar: {
    height: 90,
    width: 90,
    margin: 5,
    display: "flex",
  },
  BackText: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
  BackIcon: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  Joblisttitle: {
    color: theme.COLORS.BLACK,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },
  CustomerdetailsOne: {
    padding: 7,
    borderTopWidth: 1,
    borderTopColor: "#FA6E6E",
  },
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    paddingTop: 10,
    width: width,
  },
  cardTitle: {
    color: "#111",
    fontSize: 18,
    paddingLeft: 7,
    paddingBottom: 10,
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  cardSubTitle: {
    color: "#A0A0A0",
    fontSize: 13,
    paddingLeft: 7,
  },
  cardTitleTypeBlue: {
    color: "#d6d6d6",
    paddingRight: 10,
    paddingTop: 2,
  },
  cardTitleTypeGreen: {
    color: "#00c537",
    paddingRight: 10,
  },

  hidediv: {
    display: "none",
  },
  showdiv: {
    display: "flex",
  },
  text: {
    paddingBottom: theme.SIZES.BASE,
    color: theme.COLORS.HEADER,
    marginTop: -10,
    fontSize: 15,
  },
  cardContainer: {
    backgroundColor: "#dedede",
    borderWidth: 0,
    shadowColor: "#8898AA",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.9,
    elevation: 20,
    textAlign: "center",
    paddingTop: 20,
    marginBottom: 50,
    paddingBottom: 10,
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    backgroundColor: "#4b4b4b",
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
  },
  icons: {
    marginRight: -20,
    fontSize: 30,
  },
  iconstwo: {
    fontSize: 10,
    marginRight: 5,
    marginTop: 2,
  },
  Divider: {
    borderColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 20,
  },

  BoxSubTitle: {
    color: "#000",
    fontSize: 10,
    marginTop: 0,
    flexWrap: "nowrap",
  },
  Jobdetail: {
    borderWidth: 0,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 30,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#FFF",
    borderBottomColor: "#C5C5C5",
    height: 30,
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  buttonView: {
    backgroundColor: "#2EA9A7",
    width: 50,
    height: 25,
  },
  notes: {
    color: "gray",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  notesSolutions: {
    color: "gray",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    textAlign: "justify",
  },
  notesMain: {
    color: "gray",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    textAlign: "justify",
  },
  ListTitleLeft: {
    color: "#5C5C5C",
    fontWeight: "bold",
    fontSize: 13,
  },
  subDiv: {
    paddingLeft: 7,
  },
  ImgView: {
    display: "flex",
  },
  ImageBlock: {
    paddingLeft: 10,
  },
  Bullets: {
    color: "#000",
    fontSize: 8,
  },
  Sols: {
    paddingLeft: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 50,
      height: 40,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    elevation: 5,
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalClose: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalImage: {
    height: height - 80,
    width: width - 25,
    borderRadius: 15,
  },
  createButton: {
    width: width * 0.5,
    backgroundColor: "#3498DB",
  },
  refresshButton: {
    marginTop: 10,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#3498DB",
    marginLeft: 110,
    borderRadius: 10,
    paddingTop: 5,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnSection: {
    width: 80,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    margin: 5,
    padding: 10,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    marginTop: 10,
    marginBottom: 10,
  },

  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#FFF",
    borderBottomColor: "#C5C5C5",
    height: 30,
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  ListTitleRight: {
    color: "#848484",
    fontSize: 12,
    paddingBottom: 5,
  },
  notes: {
    color: "#848484",
    fontSize: 12,
    backgroundColor: "#F6F6F6",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
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
    fontWeight: "400",
    paddingBottom: 5,
    fontSize: 12,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  item: {
    flex: 0.5,
    backgroundColor: "#F9F9F9",
    borderTopColor: "#B7B7B7",
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
  itemTop: {
    flex: 0.5,
    marginRight: 10,
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
    marginTop: 10,
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
  optionsButtonFinish: {
    backgroundColor: '#5fd27f',
    borderRadius: 10,
    height: 40,
    width: 250
  },
});

export default FinishJobDetail;
