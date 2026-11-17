import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Pressable,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Text } from "galio-framework";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
import Themes from './Theme';

const HEADER_COLOR = Themes.COLORS.HEADER_COLOR;
const BOX_COLOR = HEADER_COLOR;
const ICON_COLOR = '#fff';
const TEXT_COLOR = '#fff';

const Dashboardpage = ({ navigation }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [dashData, setDashData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(false);
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
      icon: <MaterialIcon name="work" size={24} color={ICON_COLOR} />,
      count: dashData?.todayJobs ?? 0,
      onPress: () => navigation.navigate("MyJobs")
    },
    { 
      title: "Waiver List", 
      icon: <MaterialIcon name="assignment" size={24} color={ICON_COLOR} />,
      onPress: () => navigation.navigate("WaiverList")
    },
    { 
      title: "Issues List", 
      icon: <MaterialIcon name="report-problem" size={24} color={ICON_COLOR} />,
      onPress: () => navigation.navigate("IssueListPage")
    },
    { 
      title: "Update Times", 
      icon: <MaterialIcon name="access-time" size={24} color={ICON_COLOR} />,
      onPress: () => navigation.navigate("UpdateTime")
    },
    { 
      title: "Profile", 
      icon: <MaterialIcon name="person" size={24} color={ICON_COLOR} />,
      onPress: () => navigation.navigate("Profilepage")
    },
    { 
      title: "Refresh", 
      icon: <Icon name="refresh" size={24} color={ICON_COLOR} />,
      onPress: readData
    },
  ];

  const boxSize = (width - 60) / 3; // 3 boxes per row with padding

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      {showSpinner && <OverlaySpinner />}
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: HEADER_COLOR }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Icon name="home" size={24} color="#fff" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.headerRight}>
              <Icon name="sign-out" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{dashData?.name || 'Driver'}!</Text>
            <Text style={styles.welcomeSubtitle}>You have {dashData?.todayJobs || 0} jobs today</Text>
          </View>
          <View style={styles.welcomeIcon}>
            <MaterialCommunityIcons name="truck" size={50} color="#fff" />
          </View>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
      
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={readData} />
        }
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false} // 👈 hides vertical scroll
        showsHorizontalScrollIndicator={false} // 👈 optional, hides horizontal scroll
        scrollEnabled={false} // 👈 disables scrolling
      >
        <View style={styles.content}>
          {/* Menu Grid - 3 items per row */}
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <Pressable 
                key={index} 
                style={({ pressed }) => [
                  styles.menuItem, 
                  { 
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: pressed ? `${HEADER_COLOR}CC` : BOX_COLOR,
                  }
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuIcon}>
                  {item.icon}
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                {item.title === "My Jobs" && (
                  <Text style={styles.menuItemCount}>{item.count}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Images - Fixed Implementation */}
      <View style={styles.bottomContainer}>
        <Image
          source={require("../../images/dash-bg.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <Image
          source={require("../../images/road.png")}
          style={styles.roadImage}
          resizeMode="cover"
        />
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for bottom images
  },
  header: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  welcomeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  welcomeIcon: {
    marginLeft: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    borderRadius: 8,
    marginBottom: 15,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuIcon: {
    marginBottom: 10,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_COLOR,
    textAlign: 'center',
  },
  menuItemCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginTop: 5,
  },
  bottomContainer: {
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 240,
    position: 'relative',
    overflow: 'hidden',
   
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: -30,
    zIndex: 100,
  },
  roadImage: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
});

export default Dashboardpage;