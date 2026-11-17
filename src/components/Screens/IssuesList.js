import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  View,
  Animated,
  Easing,
  BackHandler
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text } from "galio-framework";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

import {
  STORAGE_DRIVERID,
  STORAGE_VIEW,
  URLDRIVER,
  STORAGE_ISSUEID
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width - 40;

const IssueListPage = ({ navigation }) => {
  const [showSpinner, setshowSpinner] = useState(false);
  const [issueLists, setIssueLists] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      issueList();
      startAnimation();
    });
    return unsubscribe;
  }, [navigation]);

  const startAnimation = () => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true
    }).start();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    issueList().then(() => {
      setRefreshing(false);
      startAnimation();
    });
  }, []);

  const issueList = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = { DriverId: driverid };
    setshowSpinner(true);
    
    try {
      const response = await axios.post(URLDRIVER + "GetIssueList", json, {
        headers: {
          Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
          "Content-Type": "application/json",
        },
      });
      setIssueLists(response.data);
    } catch (error) {
      console.log("API error", error);
    } finally {
      setshowSpinner(false);
    }
  };

  const handelViewDetail = async (id, type) => {
    await AsyncStorage.setItem(STORAGE_VIEW, JSON.stringify(id));
    await AsyncStorage.setItem(STORAGE_ISSUEID, JSON.stringify(type));
    navigation.navigate("IssueViewDetail");
  };


  useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            navigation.navigate('Dashboard');
            return true; // Prevent default back behavior
          }
        );
    
        return () => backHandler.remove();
      }, [navigation]);




  const renderIssueCards = () => {
    if (!issueLists || issueLists.length === 0) {
      return (
        <View style={styles.noRecordContainer}>
          <Image
            style={styles.noRecordImage}
            source={require("../../images/3371471.jpg")}
          />
          <Text style={styles.noRecordTitle}>No Issues Found</Text>
          <Text style={styles.noRecordSubtitle}>You're all caught up!</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={issueList}
          >
            <Feather name="refresh-cw" size={18} color="#3498DB" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return issueLists.map((item, index) => {
      const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [50 * (index + 1), 0],
      });

      const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      return (
        <Animated.View
          key={item.jobId}
          style={[
            styles.issueCard,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => handelViewDetail(item.IssueId, item.bookid)}
            style={styles.cardTouchable}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.jobIdText}>Job #{item.bookid}</Text>
              <View style={styles.dateChip}>
                <Text style={styles.dateText}>{item.Date}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {/* <Text style={styles.issueTitle}>Issue Description</Text> */}
              <Text style={styles.issueDescription}>{item.Issue}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
                <Feather name="chevron-right" size={18} color="#3498DB" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    });
  };

  return (
    <SafeAreaWrapper>
    <View style={styles.container}>
      {showSpinner && <OverlaySpinner />}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate("Dashboard")}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Job Issues</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={issueList}
        >
          <FontAwesome name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#3498DB"]}
            tintColor="#3498DB"
            progressBackgroundColor="#fff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderIssueCards()}
      </ScrollView>
    </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  headerButton: {
    padding: 5,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  noRecordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.15,
    padding: 20,
  },
  noRecordImage: {
    width: 180,
    height: 180,
    opacity: 0.8,
    marginBottom: 20,
  },
  noRecordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#2C3E50",
    marginBottom: 5,
  },
  noRecordSubtitle: {
    fontSize: 14,
    color: "#7D7D7D",
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: "#3498DB",
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  issueCard: {
    minHeight: CARD_HEIGHT,
    width: CARD_WIDTH,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTouchable: {
    flex: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  jobIdText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2C3E50",
  },
  // dateChip: {
  //   backgroundColor: 'lightpink',
  //   paddingHorizontal: 10,
  //   paddingVertical: 4,
  //   borderRadius: 12,
  // },
  dateChip: {
    backgroundColor: '#FFEEF1', // Light pink background
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1DC', // Slightly darker pink border
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: "#D35D6E", // Dark pink text color
  },
  cardBody: {
    flex: 1,
    marginBottom: 15,
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: "#555",
    marginBottom: 5,
  },
  issueDescription: {
    fontSize: 14,
    color: "#7D7D7D",
    lineHeight: 20,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
  },
  viewButtonText: {
    color: "#3498DB",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 5,
  },
});

export default IssueListPage;