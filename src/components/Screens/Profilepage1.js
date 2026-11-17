  import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  BackHandler,
} from "react-native";
import axios from "axios";
import { STORAGE_DRIVERID, URLDRIVER } from "../../utils/factory";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text, theme } from "galio-framework";
import { useFocusEffect } from "@react-navigation/native";


const { height, width } = Dimensions.get("window");
const thumbMeasure = (width - 48 - 32) / 4;
const Profilepage = ({ navigation, route, style }) => {

  const [driverProfile, setDriverProfile] = useState("");

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
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



  const handelProfileAjax = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
    };
    try {
      // setshowSpinner(true);
      axios
        .post(URLDRIVER + "GetProfileDetails", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setDriverProfile(response.data);
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          // always executedr
          //handleClear();
        });
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handelProfileAjax();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    handelProfileAjax();
  }, []);
  return (
    <Block style={styles.container}>
      <Block row>
        <Block flex row style={styles.Box}>
          <Block left>
            <Image
              center
              // source={{
              //   uri: 'https://www.istockphoto.com/photos/profile-avatar.pgn',
              // }}
              source={require("../../images/mms.jpg")}
              style={styles.avatar}
            />
          </Block>
          <Block left>
            <Text color="black" style={styles.BoxTitle}>
              {driverProfile.fullname}
            </Text>
            <Text style={styles.BoxSubTitle} color="black">
              Driver ID : {driverProfile.driverId}
            </Text>
          </Block>
        </Block>
      </Block>

      <Block style={styles.CustomerdetailList}>
        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Nick Name
            </Text>
          </Block>
        </Block>
        <Block row style={{ marginTop: -7 }}>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {driverProfile.fullname}
            </Text>
          </Block>
        </Block>

        <Block row style={{ marginTop: 7 }}>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Mobile No
            </Text>
          </Block>
        </Block>
        <Block row style={{ marginTop: -7 }}>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {driverProfile.mobile}
            </Text>
          </Block>
        </Block>

        <Block row style={{ marginTop: 7 }}>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Email Address
            </Text>
          </Block>
        </Block>
        <Block row style={{ marginTop: -7 }}>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {driverProfile.email}
            </Text>
          </Block>
        </Block>

        <Block row style={{ marginTop: 7 }}>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Address
            </Text>
          </Block>
        </Block>
        <Block row style={{ marginTop: -7 }}>
          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{ fontFamily: "montserrat-regular" }}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {driverProfile.address}
            </Text>
          </Block>
        </Block>

      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
    height: height,
  },
  cardTitle: {
    fontSize: 15,
    color: "#000",
    marginTop: 15,
    marginBottom: 20,
  },
  JobButton: {
    position: "absolute",
    width: width,
    bottom: 0,
  },
  ListTitleLeft: {
    color: "#000",
    paddingBottom: 10,
    width: 140,
    fontWeight: "bold",
  },
  ListTitleRight: {
    color: "#000",
    paddingBottom: 10,
  },
  Box: {
    //backgroundColor: '#fff',
    minHeight: 50,
    //shadowColor: '#8898AA',
    //shadowOffset: {width: 0, height: 1},
    //shadowRadius: 6,
    //shadowOpacity: 0.9,
    //elevation: 10,
    //margin: 30,
    //borderRadius: 10,
    marginLeft: 0,
    marginBottom: 30,
    marginTop: 30,
  },
  BoxTitle: {
    marginTop: 10,
    color: "#000",
    fontSize: 17,
    flexWrap: "wrap",
    paddingRight: 60,
  },
  BoxSubTitle: {
    color: "#000",
    fontSize: 15,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
    marginRight: 10,
  },
});

export default Profilepage;
