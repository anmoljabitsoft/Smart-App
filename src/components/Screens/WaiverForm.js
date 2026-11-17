import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  BackHandler,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Modal
} from "react-native";
import { Block, Button, Input, Text, theme } from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { OverlaySpinner } from "../../utils/Spinner";
import {
  WAIVERFROM,
  STORAGE_DRIVERID,
  STORAGE_SIGNATURE,
} from "../../utils/factory";
import { useFocusEffect } from "@react-navigation/native";
import materialTheme from "./Theme";
import SignaturePad from "../Payment/SignatureFunction";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const WaiverForm = ({ navigation, route }) => {
  const [nameText, setNameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [customerRefNo, setCustomerRefNo] = useState(route.params.paramKey);
  const [showSpinner, setshowSpinner] = useState(false);
  const [driverNotes, setDriverNotes] = useState("");
  const inputRef = useRef();
  const [errorWaiver, setErrorWaiver] = useState(false);
  const [errorWaiverOne, setErrorWaiverOne] = useState(false);
  const [showSignature, setShowSignature] = useState(null);
  const scrollViewRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
  

  const handleName = (text) => {
    if (text.length > 0) {
      setNameText(text);
      setErrorWaiver(false);
    } else {
      setNameText("");
    }
  };

  const handleEmail = (text) => {
    if (text.length > 0) {
      setEmailText(text);
      setErrorWaiverOne(false);
    } else {
      setEmailText("");
    }
  };

  const clearForm = () => {
    setErrorWaiver(false);
    setErrorWaiverOne(false);
    setNameText("");
    setEmailText("");
    setDriverNotes("");
  }

  const handleDriverNote = (text) => {
    setDriverNotes(text);
  };

  const handleProceedWaiver = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const signature = await AsyncStorage.getItem(STORAGE_SIGNATURE);
  
    const json = {
      sign: signature,
      DriverId: driverid,
      JobId: JSON.parse(customerRefNo),
      Name: nameText,
      Email: emailText,
      DriverText: driverNotes || "",
    };
  
    
    if (!nameText.trim()) {
      setErrorWaiver(true);
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }
  
    if (!emailText.trim()) {
      setErrorWaiverOne(true);
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }

    if (!signature) {
      Alert.alert("Validation Error", "Signature is mandatory.");
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailText.trim())) {
      setErrorWaiverOne(true);
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
    
    setshowSpinner(true);
  
    try {
      const response = await axios.post(WAIVERFROM + "WaiverFormEmail", json, {
        headers: {
          Authorization:
            "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
          "Content-Type": "application/json",
        },
      });
  
      if (response?.data?.status == 1) {
        Alert.alert("Success", "Waiver successfully submitted!");
        clearForm();
        await AsyncStorage.removeItem(STORAGE_SIGNATURE);
        navigation.navigate("WaiverList");
      } else {
        await AsyncStorage.removeItem(STORAGE_SIGNATURE);
        clearForm();
        Alert.alert("Error", response?.data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("API error:", error);
      const message =
        error?.response?.data?.error ||
        "Unable to submit waiver. Please check your network connection or try again later.";
      Alert.alert("Failed", message);
      clearForm();
      await AsyncStorage.removeItem(STORAGE_SIGNATURE);
    } finally {
      setshowSpinner(false);
    }
  };

  const waiverData = async () => {
    const json = {
      JobId: customerRefNo,
    };

    try {
      setshowSpinner(true);
      axios
        .post(WAIVERFROM + "AutoFillWaiver", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then(async (response) => {
          setNameText(response.data.name);
          setEmailText(response.data.email);
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(false);
        })
        .finally(function () {
          console.log("finally");
          setshowSpinner(false);
        });
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
    }
  };

  useEffect(() => {
    const getSinatureFromStorage = async () => {
      const signature = await AsyncStorage.getItem(STORAGE_SIGNATURE);
      setShowSignature(signature);
    }
    getSinatureFromStorage();
  }, [showSignature]);

  useEffect(() => {
    waiverData();
  }, []);

  

  return (
    <SafeAreaView style={styles.safeArea}>
    
         <Block row style={styles.header}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <AntDesign name="arrowleft" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}> Waiver Form</Text>
              
      
            </Block>

      {showSpinner && <OverlaySpinner />}

      <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
          {/* Terms and Conditions Section */}
          {/* <Block style={styles.termsContainer}>
            <Text style={styles.termsText}>
              I have given authorisation for MOVE MY STUFF to deliver my goods to an area where it might cause:
            </Text>
            
            <Text style={styles.bulletPoint}>{`i) minor property* damage`}</Text>
            <Text style={styles.bulletPoint}>{`ii) slight damage to the products`}</Text>
            
            <Text style={styles.termsText}>
              Minor Damages may include all points mentioned below but not limited to:
            </Text>
            
            <Text style={styles.sectionTitle}>Property:</Text>
            <Text style={styles.bulletPoint}>{`i) light scuffs/marks on the flooring/carpet`}</Text>
            <Text style={styles.bulletPoint}>{`ii) slight marks/dents on the walls inclusive of door frames`}</Text>
            <Text style={styles.bulletPoint}>{`iii) marks on the stairway railings`}</Text>
            <Text style={styles.bulletPoint}>{`iv) minor damage along access path to get the order to the room of choice`}</Text>
            
            <Text style={styles.sectionTitle}>Product:</Text>
            <Text style={styles.bulletPoint}>{`i) light scuff marks`}</Text>
            <Text style={styles.bulletPoint}>{`ii) slight dints/pressure marks due to handling`}</Text>
            <Text style={styles.bulletPoint}>{`iii) minor scrapes`}</Text>
            
            <Text style={styles.termsText}>
              Drivers should not remove goods from packaging until the items have passed through any entry areas (doors, lifts, stairs). If requested to do so, these items may be declined a Return, or will no longer be eligible to receive a Full Credit Note value if a return/exchange is allowed. All packaging must be left with the product if you intend to request return of goods.
            </Text>
            
            <Text style={styles.termsText}>
              Based on the terms and conditions outlined above and reassurance by MOVE MY STUFF that due care will be practiced throughout to ensure that minor damages are kept to a minimum. I give permission to proceed with the delivery service.
            </Text>
          </Block> */}

          {/* Form Section */}
          <Block style={styles.formContainer}>
          <Block style={[styles.card, {padding: 15}]}>
  {/* Title row with View button */}
  <Block style={styles.titleRow}>
    <Text style={styles.sectionTitle}>Terms & Conditions</Text>
    <TouchableOpacity 
      onPress={() => setModalVisible(true)}
      style={styles.chipButton}
    >
      <Text style={styles.chipButtonText}>View</Text>
    </TouchableOpacity>
  </Block>
  
  
</Block>

              <Block style={[styles.card,{padding:15}]}>
            <Block style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                // ref={inputRef}
                fontSize={14}
                value={nameText}
                placeholder="Enter your name"
                style={styles.infoInput}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={(text) => handleName(text)}
               
              />
            </Block>
            
            {/* Email */}
            <Block style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                fontSize={14}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                value={emailText}
                placeholder="Enter your email"
                style={styles.infoInput}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={(text) => handleEmail(text)}
               
              />
            </Block>
            {/* Driver Notes */}
            <Block style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Driver Notes</Text>
              <TextInput
                fontSize={14}
                placeholder="Enter driver notes here"
                multiline={true}
                numberOfLines={2}
                value={driverNotes}
                style={styles.notesInput}
                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                onChangeText={(text) => handleDriverNote(text)}
                
              />
            </Block>
            
            {/* Signature */}
            <Block style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Signature</Text>
              <Block style={styles.signatureContainer}>
                <SignaturePad />
              </Block>
            </Block>
            
           
            
            {/* Submit Button */}
            <Block style={styles.inputGroup}>
              <TouchableOpacity 
                style={styles.submitButton}  
                onPress={handleProceedWaiver}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Submit Waiver</Text>
              </TouchableOpacity>
            </Block>
            </Block>
          </Block>
        </ScrollView>
     {/* Modal for full terms */}
     <Modal
  visible={modalVisible}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <SafeAreaWrapper>
  <View style={styles.modalContainer}>
    {/* Modal Header */}
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>Waiver Terms & Conditions</Text>
    </View>
    
    <ScrollView style={styles.modalContent}>
      {/* Terms and Conditions Section */}
      {/* <Block style={styles.termsContainer}>
        <Text style={styles.termsText}>
          I have given authorisation for MOVE MY STUFF to deliver my goods to an area where it might cause:
        </Text>
        
        <Text style={styles.bulletPoint}>{`i) minor property* damage`}</Text>
        <Text style={styles.bulletPoint}>{`ii) slight damage to the products`}</Text>
        
        <Text style={styles.termsText}>
          Minor Damages may include all points mentioned below but not limited to:
        </Text>
        
        <Text style={styles.sectionTitle}>Property:</Text>
        <Text style={styles.bulletPoint}>{`i) light scuffs/marks on the flooring/carpet`}</Text>
        <Text style={styles.bulletPoint}>{`ii) slight marks/dents on the walls inclusive of door frames`}</Text>
        <Text style={styles.bulletPoint}>{`iii) marks on the stairway railings`}</Text>
        <Text style={styles.bulletPoint}>{`iv) minor damage along access path to get the order to the room of choice`}</Text>
        
        <Text style={styles.sectionTitle}>Product:</Text>
        <Text style={styles.bulletPoint}>{`i) light scuff marks`}</Text>
        <Text style={styles.bulletPoint}>{`ii) slight dints/pressure marks due to handling`}</Text>
        <Text style={styles.bulletPoint}>{`iii) minor scrapes`}</Text>
        
        <Text style={styles.termsText}>
          Drivers should not remove goods from packaging until the items have passed through any entry areas (doors, lifts, stairs). If requested to do so, these items may be declined a Return, or will no longer be eligible to receive a Full Credit Note value if a return/exchange is allowed. All packaging must be left with the product if you intend to request return of goods.
        </Text>
        
        <Text style={styles.termsText}>
          Based on the terms and conditions outlined above and reassurance by MOVE MY STUFF that due care will be practiced throughout to ensure that minor damages are kept to a minimum. I give permission to proceed with the delivery service.
        </Text>
      </Block> */}
      <Block style={styles.termsContainer}>
        <Text style={styles.termsText}>
        I have asked the movers to move my belongings to an area where it might cause some damage to the products being delivered or property where its being moved to, and areas where they might have to cross to get to the right spot. The damages may include scratches/ marks on the flooring/ carpet, marks/dents/holes in the walls, marks on the stairway railings, door frames and any other area that the drivers may come across.
        </Text>
        <Text style={[styles.termsText,{marginTop:5}]}>
        The process of attempting to move goods through tight areas or awkward access may also cause damages to the products being delivered, such as scuff marks, cuts, dents, structural damages and other unforeseen damages.
        </Text>

        <Text style={[styles.termsText,{marginTop:5}]}>
        I have been advised by the movers that they will try their best to ensure minimum damages are occurred, and I give them permission to go ahead and try to place the products at my desired spot, and I waive them from any damages that may occur as a result. I will not hold the movers responsible what so ever.
          </Text>
        
      </Block>
    </ScrollView>
    
    <TouchableOpacity 
      style={styles.closeButton}
      onPress={() => setModalVisible(false)}
    >
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
  </SafeAreaWrapper>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    // padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom:10

  },
 
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    color:"#000",
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // paddingBottom: 30,
  },
  termsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
    lineHeight: 20,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
    marginBottom: 5,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  formContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
  },
  textAreaInput: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  signatureContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    height: 100,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    marginTop: 20,
    height: 50,
    flex: 1,
    flexDirection: "row",
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#3498DB",
    justifyContent: 'center',
    alignItems: "center"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: "center"
  },

  readMoreText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 0,
    backgroundColor: 'white',
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    marginBottom: 20,
  },
  fullTermsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: 'transparent',
  },
  viewButtonText: {
    color: '#007AFF', // iOS system blue color
    fontSize: 15,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  readMoreText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  chipButton: {
    backgroundColor: '#e3f2fd', // Light blue background
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipButtonText: {
    color: '#1976d2', // Darker blue text
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WaiverForm;