import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import axios from "axios";
import { STORAGE_DRIVERID, URLDRIVER } from "../../utils/factory";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text, theme } from "galio-framework";
import AntDesign from "react-native-vector-icons/AntDesign";
import OverlaySpinner from "../../utils/Spinner";
import SafeAreaWrapper from "../SafeAreaWrapper";
const { height, width } = Dimensions.get("window");

const Profilepage = ({ navigation, route, style }) => {
  const [driverProfile, setDriverProfile] = useState({
    fullname: "",
    driverId: "",
    mobile: "",
    email: "",
    address: ""
  });

  const [showSpinner,setShowSpinner]=useState(false)

  const handelProfileAjax = async () => {
    setShowSpinner(true)
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
    };
    try {
      axios
        .post(URLDRIVER + "GetProfileDetails", json, {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setDriverProfile(response.data);
          setShowSpinner(false)
        })
        .catch((error) => {
          console.log("API error", error);
          setShowSpinner(false)
        });
    } catch (error) {
      console.log(error);
      setShowSpinner(false)
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
    <SafeAreaWrapper>
    <Block style={styles.container}>

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>
             <AntDesign name="arrowleft" style={styles.BackIcon} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerRight} />
      </View>
       {showSpinner && <OverlaySpinner />}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../images/mms.jpg")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{driverProfile.fullname}</Text>
            <Text style={styles.profileSubtext}>Driver ID: {driverProfile.driverId}</Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.detailItem}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{driverProfile.fullname}</Text>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mobile No</Text>
                <Text style={styles.detailValue}>{driverProfile.mobile}</Text>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text style={styles.detailValue}>{driverProfile.email}</Text>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={[styles.detailValue, { textAlign: 'right' }]}>{driverProfile.address}</Text>
              </View>
            </View>
          </View>

          {/* Edit Profile Button */}
          {/* <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </Block>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: '#2E86C1',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  BackIcon:{
    color:"#fff",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2E86C1',
  },
  profileInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  profileName: {
    color: '#2C3E50',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileSubtext: {
    color: '#7F8C8D',
    fontSize: 14,
    marginTop: 5,
  },
  detailsContainer: {
    margin: 16,
    marginTop: 0,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEDED',
  },
  detailItem: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
    flex: 1.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEDED',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profilepage;