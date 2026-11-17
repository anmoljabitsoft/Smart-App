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
  ScrollView,
  FlatList,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Block, Text, theme } from "galio-framework";
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

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

  const menuItems = [
    { 
      title: "My Jobs", 
      icon: <MaterialIcon name="work" size={24} color="#fff" />,
      count: dashData?.todayJobs ?? 0,
      color: "#4E7AC7",
      onPress: () => navigation.navigate("MyJobs")
    },
    { 
      title: "Waiver List", 
      icon: <MaterialIcon name="assignment" size={24} color="#fff" />,
      count: dashData?.waivers ?? 0,
      color: "#FF7D7D",
      onPress: () => navigation.navigate("WaiverList")
    },
    { 
      title: "Issues List", 
      icon: <MaterialIcon name="report-problem" size={24} color="#fff" />,
      count: dashData?.issues ?? 0,
      color: "#FFB347",
      onPress: () => navigation.navigate("IssuesList")
    },
    { 
      title: "Update Times", 
      icon: <MaterialIcon name="access-time" size={24} color="#fff" />,
      count: dashData?.timeUpdates ?? 0,
      color: "#77DD77",
      onPress: () => navigation.navigate("UpdateTimes")
    },
    { 
      title: "Profile", 
      icon: <MaterialIcon name="person" size={24} color="#fff" />,
      color: "#A78BFA",
      onPress: () => navigation.navigate("Profile")
    },
    { 
      title: "Refresh", 
      icon: <Icon name="refresh" size={24} color="#fff" />,
      color: "#9C9C9C",
      onPress: readData
    },
  ];

  const renderMenuItem = ({ item }) => (
    <Pressable 
      style={[styles.menuItem, { backgroundColor: item.color }]}
      onPress={item.onPress}
    >
      <View style={styles.menuIcon}>
        {item.icon}
      </View>
      <Text style={styles.menuItemTitle}>{item.title}</Text>
      {item.count !== undefined && (
        <Text style={styles.menuItemCount}>{item.count}</Text>
      )}
    </Pressable>
  );

  return (
    <Block flex style={styles.container}>
      {showSpinner && <OverlaySpinner />}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="home" size={20} color="#333" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.usernameText}>
            {dashData?.name ? dashData.name : 'Guest'}
          </Text>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="sign-out" size={20} color="#333" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Welcome to Driver App</Text>
          <Text style={styles.welcomeSubtitle}>Manage your deliveries efficiently</Text>
        </View>

        {/* Horizontal Scroll Menu */}
        <View style={styles.horizontalMenuContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.horizontalMenu}
          />
        </View>

        {/* Bottom Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../images/dash-bg.png")}
            style={styles.bottomImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  usernameText: {
    fontSize: 14,
    color: '#555',
    marginRight: 15,
  },
  logoutButton: {
    padding: 5,
  },
  welcomeBanner: {
    backgroundColor: '#4E7AC7',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  horizontalMenuContainer: {
    height: 180,
    marginVertical: 10,
  },
  horizontalMenu: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  menuItem: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginRight: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuItemCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  bottomImage: {
    width: '100%',
    height: '100%',
  },
});

export default Dashboardpage;