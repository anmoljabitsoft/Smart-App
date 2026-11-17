import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { STORAGE_DRIVERID, URLDRIVER, STORAGE_NAME } from "../../utils/factory";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CustomerSideBarMenu = (props) => {
  const [driverId, setDriverId] = useState();
  const [name, setName] = useState("");

  useEffect(() => {
    const handleJobData = async () => {
      try {
        const values = await AsyncStorage.getItem(STORAGE_DRIVERID);

        if (values !== null) {
          setDriverId(values);
        }
      } catch (error) {
        alert("please try agains");
      }
    };
    handleJobData();
  }, [props]);

  useEffect(() => {
    const handleJobData = async () => {
      try {
        const name = await AsyncStorage.getItem(STORAGE_NAME);

        if (name !== null) {
          setName(name);
        }
      } catch (error) {
        alert("please try agains");
      }
    };
    handleJobData();
  }, [props]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Block row>
        <Block flex row style={styles.Box}>
          <Block left>
            <Image
              center
              // source={{ uri: BASE_PATH + proileImage }}
              source={require("../../images/mms.jpg")}
              style={styles.sideMenuProfileIcon}
            />
          </Block>
          <Block left>
            <Text color="black" style={styles.BoxTitle}>
              {name}
            </Text>
            <Text style={styles.BoxSubTitle} color="black">
              Driver ID : {driverId}
            </Text>
          </Block>
        </Block>
      </Block>
      {/* <Image
        source={{ uri: BASE_PATH + proileImage }}
        style={styles.sideMenuProfileIcon}
      />
      <Text style={styles.DriverNameId}> anmol Gangawat </Text>
      <Text style={styles.DriverNameId}> Driver Id: 120000D </Text> */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 70,
    height: 50,
    borderRadius: 100 / 2,
    alignSelf: "center",
    marginRight: 0,
  },
  DriverNameId: {
    marginLeft: 90,
  },
  Box: {
    minHeight: 50,
    marginLeft: 0,
    marginBottom: 30,
    marginTop: 30,
  },
});

export default CustomerSideBarMenu;
