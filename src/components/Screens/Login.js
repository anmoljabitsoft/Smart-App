import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ImageBackground,
  BackHandler,
  Platform,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block, Button, Input, Text, theme } from "galio-framework";
import {
  STORAGE_INTRO,
  STORAGE_DRIVERID,
  STORAGE_PERSONID,
  URL,
  STORAGE_NAME,
  STORAGE_PERSONNAME,
  STORAGE_USEREMAIL,
  STORAGE_TOKEN,
  URLDRIVER,
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import materialTheme from "./Theme";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const Login = ({ navigation, route }) => {
  const [useremail, setUserEmail] = useState("");
  const [userpassword, setUserPassword] = useState("");
  const [notfound, setNotFound] = useState(false);
  const [showSpinner, setshowSpinner] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const emailRef = useRef();
  const passRef = useRef();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       setKeyboardStatus(true);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setKeyboardStatus(false);
  //     }
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleLogout();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    const json = {
      EmailId: useremail,
    };

    try {
      axios
        .post(URL + "DriverLogout", json, {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setUserEmail("");
          setUserPassword("");
          setErrorMsg("");
        })
        .catch((error) => {
          setNotFound(false);
          console.log("API error", error);
        })
        .finally(function () {
          setshowSpinner(false);
        });
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
    }
  };

  const handleChange = (name, value) => {
    setErrorMsg("");
    if (name === "email") {
      setUserEmail(value);
    } else {
      setUserPassword(value);
    }
  };

  const handleLogin = async () => {
    if (!useremail) {
      alert("Please enter user ID");
      return;
    }
  
    if (!userpassword) {
      alert("Please enter password");
      return;
    }
  
    setNotFound(false);
    setshowSpinner(true);
  
    const loginPayload = {
      EmailId: useremail,
      Password: userpassword,
      DeviceSerial: "unknown",
      DeviceName: "iPhone11,6",
      DevicePlatform: "iOS",
    };
  
    const loginUrl = `${URL}DriverLogin`;
    
    try {
      await AsyncStorage.setItem(STORAGE_USEREMAIL, useremail);
  
      const response = await axios.post(loginUrl, loginPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
  
      if (response.status === 200 && data?.loginStatus === 100) {
        const respData = data.resultData;
        
        await AsyncStorage.setItem(STORAGE_DRIVERID, respData?.rid?.toString() || "");
        await AsyncStorage.setItem(STORAGE_PERSONID, respData?.emailId || "");
        await AsyncStorage.setItem(STORAGE_PERSONNAME, respData?.fullname || "");
        navigation.navigate("Dashboard");
      } else {
        setErrorMsg(data?.resultData || "Login failed");
        alert(data?.resultData || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message);
      alert(error?.response?.data?.resultData || error.message);
    } finally {
      setshowSpinner(false);
    }
  };

  const handleToken = async () => {
    const tokens = await AsyncStorage.getItem(STORAGE_TOKEN);
    const id = await AsyncStorage.getItem(STORAGE_DRIVERID);

    const tokenObj = JSON.parse(tokens);
    const json = {
      DriverId: id,
      DeviceID: tokenObj.token,
      DeviceOS: tokenObj.os,
    }

    try {
      axios
        .post(URLDRIVER + "SaveDeviceID", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response;
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          console.log("11111111111")
        });
    } catch (error) {
      console.log("error message", error)
    }
  }

  const readData = async () => {
    const userid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const introflag = await AsyncStorage.getItem(STORAGE_INTRO);
    if (userid === null || userid === undefined) {
        // navigation.navigate('Jobs');
    } else {
      if (introflag==null || introflag==undefined) {
        await navigation.navigate("IntroPage");
      } else {
        navigation.navigate("Dashboard");
      }
    }
  };
  
  useEffect(() => {
    readData();
  }, []);

  return (
    <SafeAreaWrapper>
      <Block flex style={styles.container}>
        {showSpinner && <OverlaySpinner />}
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}
          >
            <Block style={styles.loginContainer}>
              {/* Logo Section */}
              <Block style={styles.logoContainer}>
                <Image
                  source={require("../../images/pacelogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Driver Login</Text>
              </Block>
              
              {/* Form Section */}
              <View style={styles.formContainer}>
                <Block style={styles.inputContainer}>
                  <Input
                    ref={emailRef}
                    rounded
                    type="email-address"
                    placeholder="Email Address"
                    placeholderTextColor="#9A9A9A"
                    autoCapitalize="none"
                    style={styles.input}
                    value={useremail}
                    onChangeText={(text) => handleChange("email", text)}
                    right
                    icon="email"
                    family="FontAwesome"
                    iconSize={16}
                    iconColor="#3498db"
                    iconStyle={styles.inputIcon}
                    onFocus={() => setKeyboardOpen(true)}
                    onBlur={() => setKeyboardOpen(false)}
                  />
                </Block>
                
                <Block style={styles.inputContainer}>
                  <Input
                    ref={passRef}
                    rounded
                    password={!passwordVisible}
                    viewPass
                    placeholder="Password"
                    placeholderTextColor="#9A9A9A"
                    style={styles.input}
                    value={userpassword}
                    onChangeText={(text) => handleChange("password", text)}
                    onFocus={() => setKeyboardOpen(true)}
                    onBlur={() => setKeyboardOpen(false)}
                    left
                    family="FontAwesome"
                    iconSize={16}
                    iconColor="#3498db"
                    iconStyle={styles.inputIcon}
                    right={
                      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Icon 
                          name={passwordVisible ? "eye-slash" : "eye"} 
                          size={20} 
                          color="#9A9A9A"
                          style={styles.eyeIcon}
                        />
                      </TouchableOpacity>
                    }
                  />
                </Block>
                
                {errorMsg ? (
                  <Text style={styles.errorText}>{errorMsg}</Text>
                ) : null}
                
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </Block>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Fixed Bottom Images with conditional zIndex */}
        {/* <View style={[
          styles.bottomImagesContainer,
          { display: keyboardStatus ? "none" : "flex" }
        ]}>
          <Image
            source={require("../../images/dash-bg.png")}
            style={styles.backgroundBottomImage}
            resizeMode="cover"
          />
          <Image
            source={require("../../images/road.png")}
            style={styles.roadImage}
            resizeMode="stretch"
          />
        </View> */}
      </Block>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150, // Space for bottom images
  },
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 70,
    paddingHorizontal: 20,
    marginBottom: 20,
    flex:1,
    justifyContent:"center"
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginTop: 1,
    fontFamily: 'montserrat-bold',
  },
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 25,
    height: 50,
    backgroundColor: '#FFFFFF',
    paddingLeft: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginRight: 15,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2980B9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
  },
  bottomImagesContainer: {
    width: '100%',
    height: '40%',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundBottomImage: {
    position: 'absolute',
    width: '100%',
    height: '85%',
    top: 18, 
    zIndex:100,
   
  },
  roadImage: {
    position: 'absolute',
    width: '100%',
    height: 50,
    bottom: -10,
  },
});

export default Login;