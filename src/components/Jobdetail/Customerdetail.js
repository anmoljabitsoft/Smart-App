import React, { useEffect, useState } from "react";

import {
  Dimensions,
  StyleSheet,
  Modal,
  Alert,
  View,
  TouchableOpacity
} from "react-native";

import { Block, Button, Text } from "galio-framework";

import SelectDropdown from "react-native-select-dropdown";

import { OverlaySpinner } from "../../utils/Spinner";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import {
  URLDRIVER,
  STORAGE_DRIVERID,
  URLSMS,
  STORAGE_JOBID,
} from "../../utils/factory";

import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get("window");

import axios from "axios";
import CustomTimeDropdown from "./CustomTimeSelect";

const datas = ['Select Time', '10-15 Minutes', '15-30 Minutes', '30-45 Minutes', '45-60 Minutes'];

// const countries = ["Egypt", "Canada", "Australia", "Ireland"]


const Customerdetail = ({ navigation, route, style, jobDetail }) => {

  const data = jobDetail && jobDetail?.jobDetail;

  const [modalVisible, setModalVisible] = useState(false);


  const [selectedTime, setSelectedTime] = useState("");

  const [name, setName] = useState('');

  const [showSpinner, setshowSpinner] = useState(false);


  const [phone, setPhone] = useState('');

  const [visiblePopup, setVisiblePopup] = useState('');
// console.log("ddddddwdwdwdata",data?.pickupAddresses);

  useEffect(() => {
    setVisiblePopup('')
    if (data && data?.pickupAddresses) {
      setName(data && data?.pickupAddresses[0]?.name);
      setPhone(data && data?.pickupAddresses[0]?.phone);
      setVisiblePopup(data && data?.sMSDetails);

    }
  }, [data]);


  console.log("kkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyy",data)
  
  const readData = async () => {

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);

    const json = {
      DriverId: driverid,
    };

    const map = [];

    try {
      axios
        .post(URLDRIVER + "CustomerNotificationTime", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // const data = response.data;
          // if (data) {
          //   data.forEach((item) => {
          //     map.push({ sno: item.sno, time: item.time });
          //   });
          //   setDatas(map);
          // }
        })
        .catch((error) => {
          console.log("API error", error);
          readData();
        })
        .finally(function () {
          console.log("Finally Call");
        });
    } catch (error) {
      console.log(error);
      readData();
    }
  };

  const handleSendData = async () => {

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);

    const JobId = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      DriverId: driverid,
      JobId: JSON.parse(JobId),
      BusinessName: data?.customerName,
      CustomerMobile: visiblePopup?.mobile, //"+61 430 918 798" ,
      CustomerName: visiblePopup?.name,
      Time: selectedTime,

    };
    try {
      setshowSpinner(true);
      if(!selectedTime || selectedTime=="Select Time"){
        Alert.alert("Required !","Please select time");
        setshowSpinner(false);
        setSelectedTime("")
      }
      if (selectedTime && selectedTime!=="Select Time") {
        axios
          .post(URLSMS + "ArrivalNotificationSMS", json, {
            headers: {
              Authorization:
                "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("ressssspppppp",response)
            setshowSpinner(false);
            setSelectedTime('');
            alert("SMS Sent Successfully");
            setModalVisible(false);
          })
          .catch((error) => {
            setshowSpinner(false);
            console.log("API error", error);
          })
          .finally(function () {
            setshowSpinner(false);

            console.log("Finally Call");
          });
      }
    } catch (error) {
      setshowSpinner(false);

      console.log(error);
    }
  };


  const handleSelectTime = (time) => {
    console.log("Selected:", time);
    setSelectedTime(time);
  };


  useEffect(async () => {
    const sendSmsToCustomerPopup = async () => {
      await readData();
    };
    sendSmsToCustomerPopup();
  }, []);

  return (
    <Block style={styles.cardContainer}>
      <Block row style={styles.Customerdetails}>
        <Block flex>
          <Text size={14} style={styles.cardTitle} color="white">
            Customer Detail
          </Text>
        </Block>
      </Block>
      <Block style={styles.CustomerdetailList}>
        <Block row>
          <Block flex>
            <Text
              size={14}
              style={styles.ListTitleLeft}
              // color={theme.COLORS.SECONDARY}
            >
              Name
            </Text>
          </Block>

          <Block flex right>
            <Text
              size={14}
              style={styles.ListTitleRight}
            >
              {data?.customerName}
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block>
            <Text
              size={14}
              style={styles.ListTitleLeft}
              // color={theme.COLORS.SECONDARY}
            >
              Phone
            </Text>
          </Block>

          <Block flex right>
            <Text

              size={14}

              style={styles.ListTitleRight}
              // color={theme.COLORS.SECONDARY}
            >
              {data?.customerMobile}
            </Text>
          </Block>
        </Block>
      </Block>

      <Block>
        <Block flex>
          <View style={styles.centeredView}>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                {showSpinner && <OverlaySpinner />}

                <View style={styles.modalView}>
                  <Block>
                    <Text style={styles.modalText}>
                      Send Arrival Notification To Customer
                    </Text>
                    <Block row>
                      <Block>
                        <Text
                          style={styles.ListTitleLeftPOP}
                          // color={theme.COLORS.SECONDARY}
                        >
                          Customer Name
                        </Text>
                      </Block>

                      <Block flex right>
                        <Text
                          size={14}
                          style={styles.ListTitleRightPOP}
                          // color={theme.COLORS.SECONDARY}
                        >
                          {visiblePopup?.name || ""}
                        </Text>
                      </Block>
                    </Block>
                    <Block row>
                      <Block>
                        <Text
                          style={styles.ListTitleLeftPOP}
                          // color={theme.COLORS.SECONDARY}
                        >
                          Customer Mobile
                        </Text>
                      </Block>

                      <Block flex right>
                        <Text
                          size={14}
                          style={styles.ListTitleRightPOP}
                          // color={theme.COLORS.SECONDARY}
                        >
                          {visiblePopup?.mobile || ""}
                        </Text>
                      </Block>
                    </Block>
                    <Block row style={styles.TimeBlock}>
                      <Block flex>
                        <Text
                          style={styles.ListTitleLeftPOP}
                          // color={theme.COLORS.SECONDARY}
                        >
                          Estimated Time
                        </Text>
                      </Block>
                    </Block>
                    <Block row>
                      <Block flex>
                        {/* <SelectDropdown
                          data={datas}
                          onSelect={(selectedItem, index) => {
                            setSelectedTime(selectedItem);
                          }}
                          defaultButtonText={"Select Time"}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                          buttonStyle={styles.dropdown1BtnStyle}
                          buttonTextStyle={styles.dropdown1BtnTxtStyle}
                          renderDropdownIcon={(isOpened) => {
                            return (
                              <FontAwesome
                                name={isOpened ? "chevron-up" : "chevron-down"}
                                color={"#444"}
                                size={13}
                              />
                            );
                          }}
                          dropdownIconPosition={"right"}
                          dropdownStyle={styles.dropdown1DropdownStyle}
                          rowStyle={styles.dropdown1RowStyle}
                          rowTextStyle={styles.dropdown1RowTxtStyle}
                        /> */}
                        {/* New Dropdown */}
                        <CustomTimeDropdown
                           data={datas}
                           onSelect={handleSelectTime}
                        />
                      </Block>
                    </Block>
                  </Block>

                  <Block row style={styles.btnBlock}>
                    <TouchableOpacity activeOpacity={0.4}
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle1}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.4}
                      style={[styles.button, styles.buttonSend]}
                      onPress={() => handleSendData()}
                    >
                      <Text style={styles.textStyle1}>Send SMS</Text>
                    </TouchableOpacity>
                  </Block>
                </View>
              </View>
            </Modal>
          </View>


          <View style={{ marginTop: 20 }}>
            {(visiblePopup?.name !== '0' && visiblePopup?.name !== '') && (visiblePopup?.mobile !== '0' && visiblePopup?.mobile !== '') &&
              <Block row center style={styles.btnSMS}>
                <TouchableOpacity activeOpacity={0.4} onPress={() => setModalVisible(true)}>
                  <Text style={styles.textStyle}>Send SMS To Customer</Text>
                </TouchableOpacity>
              </Block>
            } 
            
          </View>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderWidth: 0.1,
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  Customerdetails: {
    backgroundColor: "#F66262",
    padding: 5,
    height: 30,
    borderRadius: 10,
  },
  CustomerdetailList: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    lineHeight: 30,
    height: 50,
  },
  ListTitleLeft: {
    color: "#000",
    fontSize: 12,
    paddingBottom: 3,
  },
  ListTitleRight: {
    color: "#848484",
    fontSize: 12,
    paddingBottom: 3,
  },
  ListTitleLeftPOP: {
    color: "#000",
    paddingBottom: 5,
    fontSize: 12,
  },
  ListTitleRightPOP: {
    color: "#808080",
    paddingBottom: 5,
    fontSize: 12,
  },
  cardTitle: {
    height: 20,
    paddingLeft: 5,
    textTransform: "uppercase",
  },
  CustomerButton: {
    color: "#808080",
    textAlign: "center",
    width: 117,
    height: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginHorizontal: 80,
    elevation: 0,
    marginTop: 25,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "#191919",
    opacity: 0.9,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    borderWidth: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    height: 35,
    width: 114,
    elevation: 5,
    textAlign: "center",
  },
  buttonOpen: {
    backgroundColor: "#808080",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonSend: {
    backgroundColor: "#48BCC0",
    marginLeft: 10,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    backgroundColor: "#000",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 5,
    fontSize: 12,
    width: width / 1.2,
  },
  textStyle1: {
    color: "white",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    fontSize: 12,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ADADAD",
    paddingBottom: 3,
  },
  btnSMS: {
    textAlign: "right",
    marginTop: 0,
  },
  btnBlock: {
    marginTop: 15,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 30,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 10 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#FFF",
    borderBottomColor: "#C5C5C5",
    height: 30,
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  TimeBlock: {
    marginTop: 10,
  },
});

export default Customerdetail;
