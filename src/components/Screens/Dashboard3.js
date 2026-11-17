import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Block, Text } from "galio-framework";
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

const { width, height } = Dimensions.get("window");

const Dashboardpage = ({ navigation }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [dashData, setDashData] = useState({});

  const readData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_DRIVERID);
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
      setDashData(responseData);
      await AsyncStorage.setItem(STORAGE_NAME, responseData?.name ?? "");
    } catch (error) {
      console.log("Dashboard API error:", error?.message);
      Alert.alert("Failed to fetch dashboard data.");
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
              setShowSpinner(true);
              const response = await axios.post(`${URL}DriverLogout`, json, {
                headers: { "Content-Type": "application/json" },
              });

              setShowSpinner(false);
              if (response?.data?.[0]?.ret === 1) {
                await AsyncStorage.multiRemove([STORAGE_USEREMAIL, STORAGE_DRIVERID]);
                navigation.navigate("Login");
              } else {
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

  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => true;
  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);
  //     return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //   }, [])
  // );

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

  const menuItems = [
    { 
      title: "My Jobs", 
      icon: <MaterialIcon name="work" size={18} color="#fff" />,
      count: dashData?.todayJobs ?? 0,
      color: "#4E7AC7",
      onPress: () => navigation.navigate("MyJobs")
    },
    { 
      title: "Waiver List", 
      icon: <MaterialIcon name="assignment" size={18} color="#fff" />,
      count: dashData?.waivers ?? 0,
      color: "#FF7D7D",
      onPress: () => navigation.navigate("WaiverList")
    },
    { 
      title: "Issues List", 
      icon: <MaterialIcon name="report-problem" size={18} color="#fff" />,
      count: dashData?.issues ?? 0,
      color: "#FFB347",
      onPress: () => navigation.navigate("IssuesList")
    },
    { 
      title: "Update Times", 
      icon: <MaterialIcon name="access-time" size={18} color="#fff" />,
      count: dashData?.timeUpdates ?? 0,
      color: "#77DD77",
      onPress: () => navigation.navigate("UpdateTimes")
    },
    { 
      title: "Profile", 
      icon: <MaterialIcon name="person" size={18} color="#fff" />,
      color: "#A78BFA",
      onPress: () => navigation.navigate("Profile")
    },
    { 
      title: "Refresh", 
      icon: <Icon name="refresh" size={18} color="#fff" />,
      color: "#9C9C9C",
      onPress: readData
    },
  ];

  return (
    <View style={styles.container}>
      {showSpinner && <OverlaySpinner />}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="home" size={16} color="#333" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.usernameText}>
            {dashData?.name ? dashData.name : 'Guest'}
          </Text>
          <Pressable onPress={handleLogout}>
            <Icon name="sign-out" size={16} color="#333" style={{ marginLeft: 10 }} />
          </Pressable>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>Driver App</Text>
          <Text style={styles.welcomeSubtitle}>Manage deliveries</Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
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
          ))}
        </View>
      </View>

      {/* Road and Background Images */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../images/dash-bg.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <Image
          source={require("../../images/road.png")}
          style={styles.roadImage}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5EB',
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
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  usernameText: {
    fontSize: 13,
    color: '#555',
  },
  content: {
    flex: 1,
    paddingBottom: 10,
  },
  welcomeBanner: {
    backgroundColor: '#4E7AC7',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  menuItem: {
    width: '31%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  menuItemCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 3,
  },
  imageContainer: {
    width: '100%',
    height: '40%',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '80%',
    top: 25, 
    zIndex: 100,
  },
  roadImage: {
    position: 'absolute',
    width: '100%',
    height: 80,
    bottom: -15,

  },
});

export default Dashboardpage;