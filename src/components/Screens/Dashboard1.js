import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  BackHandler,
  Linking,
  Alert,
  View,
  Pressable,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Block, Text, theme } from "galio-framework";
import { useFocusEffect } from "@react-navigation/native";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/FontAwesome';


import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { OverlaySpinner } from "../../utils/Spinner";
import {
  URLDRIVER,
  STORAGE_DRIVERID,
  STORAGE_NAME,
  STORAGE_REDIRECTIONATJOBLISTPAGE,
  STORAGE_USEREMAIL,
  URL,
} from "../../utils/factory";

const { height, width } = Dimensions.get("window");

const Dashboardpage = ({ navigation }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [dashData, setDashData] = useState({});

  const readData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_DRIVERID);
      console.log("USERID>>>>>>>>>>>>>>>",userId);
      if (!userId) return;

      setShowSpinner(true);

      const response = await axios.post(
        `${URLDRIVER}DashboardDetails`,
        { driverid: userId },
        {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response?.data;
      console.log("dddddddddddddddddaw",responseData);
      setDashData(responseData);
      await AsyncStorage.setItem(STORAGE_NAME, responseData?.name ?? "");
    } catch (error) {
      console.log("Dashboard API error:", error?.message);
      Alert.alert("Failed to fetch dashboard data.",userId);
    } finally {
      setShowSpinner(false);
    }
  }, []);

 

const handleLogout = async () => {
  Alert.alert(
    "Confirm Logout",
    "Are you sure you want to log out?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            const useremail = await AsyncStorage.getItem(STORAGE_USEREMAIL);

            if (!useremail) {
              alert("No user session found.");
              return;
            }

            const json = { EmailId: useremail };
            const logoutUrl = `${URL}DriverLogout`;

            console.log("Logging out with payload:", json);
            console.log("Logout URL:", logoutUrl);

            setShowSpinner(true);

            const response = await axios.post(logoutUrl, json, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            setShowSpinner(false);

            if (response?.data?.[0]?.ret === 1) {
              await AsyncStorage.multiRemove([STORAGE_USEREMAIL, STORAGE_DRIVERID]);
              navigation.navigate("Login");
            } else {
              console.warn("Logout failed response:", response?.data);
              alert("Something went wrong. Please try again.");
            }
          } catch (error) {
            console.error("Logout error:", error);
            setShowSpinner(false);
            alert("An error occurred while logging out.");
          }
        }
      }
    ],
    { cancelable: true }
  );
};

  

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => true;
//       BackHandler.addEventListener("hardwareBackPress", onBackPress);
//       return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
//     }, [])
//   );

  useEffect(() => {
    const checkRedirection = async () => {
      const shouldRedirect = await AsyncStorage.getItem(STORAGE_REDIRECTIONATJOBLISTPAGE);
      if (shouldRedirect === "1") {
        navigation.navigate("MyJobs");
      }
    };

    checkRedirection();
    readData();
  }, [readData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setDashData({});
      readData();
    });
    return unsubscribe;
  }, [navigation, readData]);

  const handleNewJob = () => navigation.navigate("MyJobs");

//   const openLink = async () => {
//     const url = "https://github.com/proyecto26";
//     try {
//       if (await InAppBrowser.isAvailable()) {
//         await InAppBrowser.open(url, {
//           toolbarColor: "#6200EE",
//           showTitle: true,
//           enableDefaultShare: true,
//           enableUrlBarHiding: true,
//         });
//       } else {
//         Linking.openURL(url);
//       }
//     } catch (error) {
//       Alert.alert("Unable to open link", error?.message);
//     }
//   };

  return (
    <Block flex>
      {showSpinner && <OverlaySpinner />}
      <View style={styles.pageHeader}  color={theme.COLORS.SECONDARY}>
        <View style={styles.headerLeft}>
          <Icon name="home" size={20} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.pageTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerLeft}>
        <Text style={styles.usernameText}>
          {dashData?.name ? dashData.name : 'Guest'}
        </Text>
        <Pressable onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="#333"  style={{ marginLeft: 15 }} />
          </Pressable>
        </View>
       
      </View>
      <Block style={styles.container}>
        {/* <Text size={16} style={styles.CustomerName}>
          {dashData?.name ? `Hello ${dashData?.name},` : "Hello"}
        </Text>
        <Text size={14} style={styles.text}>
          You can start accepting jobs.
        </Text>
        <Block row>
          <Text size={14} style={styles.title}>
            Today's Update
          </Text>
        </Block> */}

      <Block row style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Update</Text>
      </Block>

        <Block card flex style={styles.cardContainer}>
          {/* <Block center>
            <Text style={{ marginBottom: 20 }}>{dashData?.liveJob ?? '0'}</Text>
          </Block> */}
          <Block flex row>
            <Block flex center>
              <Text
                size={14}
                style={styles.cardTitle2}
                color={theme.COLORS.SECONDARY}
                onPress={handleNewJob}
              >
                {dashData?.todayJobs ?? 0}
              </Text>
              <Text
                size={14}
                style={styles.cardTitle}
                color={theme.COLORS.SECONDARY}
                onPress={handleNewJob}
              >
                New Jobs
              </Text>
            </Block>

            <Block flex center>
              <Text
                size={14}
                style={styles.cardTitle2}
                color={theme.COLORS.SECONDARY}
                onPress={readData}
              >
                
              <Icon name="retweet" size={22} color={"#9C9C9C"} />
              </Text>
              <Text
                size={14}
                style={styles.cardTitle}
                color={theme.COLORS.SECONDARY}
                onPress={readData}
              >
                Refresh
              </Text>
            </Block>
          </Block>
        </Block>

        <Block card flex style={styles.cardContainer2}>
          <Block center>
            <Image
              style={{
                marginTop: 0,
                marginBottom: 0,
                backgroundColor: "#0d92f3",
                width: 320,
                height: 200,
                position: "absolute",
              }}
              source={require("../../images/dash-bg.png")}
            />
            <Image
              source={require("../../images/road.png")}
              style={{ marginTop: 210, width: 330 }}
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  pageHeader: {
    color: theme.COLORS.BLACK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    
  
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  
   // Bottom border
  borderBottomWidth: 2,
  borderBottomColor: '#ddd', // light gray line
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  
  usernameText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  
  container1: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'lightgray',
    // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width,
    height,
    paddingTop: 10,
  },
  CustomerName: {
    paddingBottom: theme.SIZES.BASE,
    color: theme.COLORS.BLACK,
    fontSize: 18,
  },
  text: {
    color: theme.COLORS.HEADER,
    marginTop: -10,
    fontSize: 15,
    paddingBottom: theme.SIZES.BASE,
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "600",
    color: theme.COLORS.BLACK,
    paddingBottom: theme.SIZES.BASE,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderWidth: 0,
    minHeight: 60,
    marginBottom: 4,
    elevation: 20,
    textAlign: "center",
    paddingTop: 20,
  },
  cardContainer2: {
    backgroundColor: "#fff",
    borderWidth: 0,
    minHeight: 160,
    marginBottom: 100,
    elevation: 20,
    textAlign: "center",
    paddingTop: 0,
  },
  cardTitle2: {
    backgroundColor: "#fff",
    textAlign: "center",
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 15,
    borderRadius: 50,
    height: 80,
    width: 80,
    lineHeight: 60,
    fontSize: 30,
    borderWidth: 7,
    borderColor: "#f66263",
    fontWeight: "bold",
  },
  cardTitle: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 15,
    color: "#000",
    fontSize: 12,
  },
});

export default Dashboardpage;
