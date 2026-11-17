import React, { useState } from "react";
import axios from 'axios';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    BackHandler,
    Image,
    Linking,
    TouchableOpacity,
    View,
    Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text, theme, Input } from "galio-framework";
import {
    URL,
    STORAGE_DRIVERID,
    STORAGE_VIEW,
    URLDRIVER,
    STORAGE_ISSUEID,
    URLEMAIL
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import materialTheme from "./Theme";
import { InAppBrowser } from "react-native-inappbrowser-reborn";

import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const WaiverList = ({ navigation, route, style }) => {
    const [joblist, setjoblist] = useState([]);
    const [pickaddress, setPickaddress] = useState([]);
    console.log("pickup addresses", pickaddress);
    const [allPickupAddresses, setAllPickupAddresses] = useState([]);
    const [showSpinner, setshowSpinner] = useState(false);
    const [issueLists, setIssueLists] = useState([]);
    const [text, setText] = useState('');

    const openURI = async (urlPath) => {
        console.log("222222222222222222222222222222222", urlPath);
        const url = urlPath
        const supported = await Linking.canOpenURL(url); //To check if URL is supported or not.
        if (supported) {
            await Linking.openURL(url); // It will open the URL on browser.
        } else {
            alert(`Don't know how to open this URL: ${url}`);
        }
    }


    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            getWaiverListHandler();
            setText('');

        });
        return unsubscribe;
    }, [navigation]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBackPress = () => {
    //             return true;
    //         };

    //         BackHandler.addEventListener("hardwareBackPress", onBackPress);

    //         return () => {
    //             BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    //         };
    //     }, [])
    // );



    const getWaiverListHandler = async () => {
        setText('');
        setIssueLists([]);
        const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
        const json = {
            DriverId: driverid,
        };
        setshowSpinner(true);
        try {
            axios
                .post(URLEMAIL + "WaiverList", json, {
                    headers: {
                        Authorization:
                            "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    setshowSpinner(false);
                    // console.log("####################################", response.data.data);
                    const responseList = response.data.data;
                    setIssueLists(JSON.parse(responseList));
                })
                .catch((error) => {
                    setshowSpinner(false);
                    console.log("API error", error);
                })
                .finally(function () {
                    setshowSpinner(false);
                    console.log("Finally Call");
                });
        } catch (error) {
            setshowSpinner(false);

            console.log(error);
        }
    };


    const handleName = (text) => {
        if (text.length > 0) {
            setText(text);
        } else {
            setText('');
        }
    }

    const openLink = async (urlpath) => {
        // console.log("hssssssssss",urlpath);
        try {
          const url = urlpath;
          if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: "cancel",
              preferredBarTintColor: "#3498DB",
              preferredControlTintColor: "white",
              readerMode: false,
              animated: true,
              modalPresentationStyle: "fullScreen",
              modalTransitionStyle: "coverVertical",
              modalEnabled: true,
              enableBarCollapsing: false,
              // Android Properties
              showTitle: true,
              toolbarColor: "#3498DB",
              secondaryToolbarColor: "black",
              navigationBarColor: "black",
              navigationBarDividerColor: "white",
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
             
              animations: {
                startEnter: "slide_in_right",
                startExit: "slide_out_left",
                endEnter: "slide_in_left",
                endExit: "slide_out_right",
              },
              headers: {
                "my-custom-header": "my custom header value",
              },
            });
          } else Linking.openURL(url);
        } catch (error) {
          // Alert.alert(error.message);
    
        }
      };


    const handelViewDetail = async (item) => {
        if(!text) {
            Alert.alert("Error",'Please Enter OTP');
            return;
        }
        if (text) {
            const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
            const json = {
                DriverId: driverid,
                JobId: item.Jobid,
                sno: item.sno
            };

            try {
                if (item.OTP != text) {
                    Alert.alert("Error",'Please enter valid otp');
                    return;
                } else {
                    setshowSpinner(true);
                  await axios.post(URLEMAIL + "WaiverOTPVerify", json, {
                            headers: {
                                Authorization:
                                    "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
                                "Content-Type": "application/json",
                            },
                        })
                        .then((response) => {
                            setshowSpinner(false);
                            alert("OTP Verified Successfully");
                            setText('');
                            getWaiverListHandler();
                        })
                        .catch((error) => {
                            setshowSpinner(false);
                            console.log("API error", error);
                        })
                        .finally(function () {
                            setshowSpinner(false);
                            console.log("Finally Call");
                        });
                }
            } catch (error) {
                setshowSpinner(false);
                console.log(error);
            }
        }
        
    };

    return (
        <>
         <SafeAreaWrapper>
        {showSpinner? (
             <Block flex style={{ backgroundColor: "#fff" }}>
             <View style={styles.header}>
             <TouchableOpacity 
             style={styles.backButton} 
             onPress={() => {
                 navigation.navigate("Dashboard");
             }}
             >
       <AntDesign name="arrowleft" size={24} color="#fff" />
     </TouchableOpacity>
     
     <Text style={styles.headerTitle}> Waiver List</Text>
     
     <TouchableOpacity 
       style={styles.headerButton}
       onPress={getWaiverListHandler}
     >
       <FontAwesome name="refresh" size={20} color="#fff" />
     </TouchableOpacity>
             </View>
             <OverlaySpinner />
             </Block>
            
        ) : (
            
            <Block flex style={{ backgroundColor: "#fff" }}>
            <View style={styles.header}>
            <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
                navigation.navigate("Dashboard");
            }}
            >
      <AntDesign name="arrowleft" size={24} color="#fff" />
    </TouchableOpacity>
    
    <Text style={styles.headerTitle}> Waiver List</Text>
    
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={getWaiverListHandler}
    >
      <FontAwesome name="refresh" size={20} color="#fff" />
    </TouchableOpacity>
            </View>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
        >
            <Block style={styles.container}>
                {issueLists && issueLists.length == 0 ? (
                    <Block center style={styles.ViewImage}>
                        <Image
                            style={styles.NoRecordImage}
                            source={require("../../images/3371471.jpg")}
                        ></Image>
                        <Text>No Record Found</Text>
                    </Block>
                ) : (
                    issueLists &&
                    issueLists.length > 0 &&
                    issueLists.map((item) => (
                        <Block style={styles.cardContainerOne} key={item.Jobid}>
                            <Block flex style={item.isVerified == '1' ? styles.CustomerdetailsOneGreen : styles.CustomerdetailsOneRed}>
                                <Block flex row>
                                    <View
                                        size={14}
                                        style={styles.cardTitle}
                                        color={theme.COLORS.SECONDARY}
                                    >
                                        {/* item.isVerified == '0' && {item.date} */}
                                       <Text>Job ID : {item.Jobid}</Text> <Text style={styles.cardSubTitle}>{item.isVerified == '0' ? item.date:"" }</Text> 
                                    </View>
                                </Block>

                                <Block flex row>
                                    <Text
                                        size={12}
                                        style={styles.cardTitle1}
                                        color={theme.COLORS.SECONDARY}
                                    >
                                        {item.name}
                                    </Text>
                                </Block>

                                <Block flex row>
                                    <Text
                                        size={12}
                                        style={styles.cardTitle2}
                                        color={theme.COLORS.SECONDARY}
                                    >
                                        {item.email}
                                    </Text>
                                </Block>

                                <Block row style={{ paddingLeft: 10 }}>
                                    {item.isVerified == '0' &&
                                        <Block style={{ width: width / 2 }}>
                                            <Input
                                                fontSize={12}
                                                maxLength={6}
                                                type='number-pad'
                                                placeholder="Enter OTP"
                                                style={{
                                                    width: width * 0.55,
                                                    backgroundColor: '#F6F6F6',
                                                    borderColor: '#DDDDDD',
                                                    height: 35,
                                                }}
                                                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                                                onChangeText={(text) => handleName(text)}
                                            />
                                        </Block>
                                    }

                                    {item.isVerified == '1' &&
                                        <Block flex style={styles.centerButton}>
                                            <Button
                                                textStyle={{
                                                    fontFamily: "montserrat-regular",
                                                    fontSize: 15,
                                                }}
                                                small
                                                center
                                                color="success"
                                                style={styles.buttonView1}
                                                onPress={() => {
                                                    openLink(item.pdfUrl);
                                                }}
                                            >
                                                View PDF
                                            </Button>
                                        </Block>
                                    }


                                    {item.isVerified == '0' &&
                                        <Block flex style={styles.centerButton}>

                                            <Button
                                                textStyle={{
                                                    fontFamily: "montserrat-regular",
                                                    fontSize: 13,
                                                }}
                                                small
                                                center
                                                color="success"
                                                style={styles.buttonView}
                                                onPress={() => {
                                                    handelViewDetail(item);
                                                }}
                                            >
                                                Verify OTP
                                            </Button>
                                        </Block>
                                    }

                                </Block>

                            </Block>
                        </Block>
                    ))
                )}
            </Block>
        </ScrollView>
    </Block>
        )}
        </SafeAreaWrapper>
        </>
       
    );
};

const styles = StyleSheet.create({
    cardContainerOne: {
        backgroundColor: "#fff",
        borderWidth: 0,
        //height: height < 500 ? height * 0.5 : height * 0.5,
        shadowColor: "#8898AA",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 6,
        shadowOpacity: 0.9,
        elevation: 20,
        textAlign: "center",
        // eslint-disable-next-line no-dupe-keys
        marginBottom: 15,
        paddingBottom: 0,
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
   
    Joblisttitle: {
        color: theme.COLORS.BLACK,
        fontSize: 16,
        fontWeight: "600",
        marginTop: 3,
    },
    CustomerdetailsOneRed: {
        padding: 7,
        borderLeftColor: "#ED3939",
        borderLeftWidth: 3,
    },
    CustomerdetailsOneGreen: {
        padding: 7,
        borderLeftColor: "#3FAC46",
        borderLeftWidth: 3,
    },
    container: {
        paddingHorizontal: theme.SIZES.BASE,
        backgroundColor: "#fff",
        paddingTop: 10,
        width: width,
    },
    cardTitle: {
        color: "#000",
        fontSize: 18,
        paddingLeft: 10,
        display:"flex",
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        
       
    },
    cardTitleInner: {
        color: '#9E9E9E',
        fontSize: 14
        
    },
    cardTitle1: {
        color: "#B0B0B0",
        fontSize: 14,
        paddingLeft: 10,
        paddingTop: 7
    },
    cardTitle2: {
        color: "#B0B0B0",
        fontSize: 14,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    cardSubTitle: {
        color: "#A0A0A0",
        fontSize: 13,
        marginRight: 10,
    },
    cardTitleTypeBlue: {
        color: "#d6d6d6",
        paddingRight: 10,
        paddingTop: 2,
    },
    // dropDownBrand: {
    //   borderColor: theme.COLORS.INFO,
    //   width: width * 0.8,
    //   borderRadius: theme.SIZES.BASE * 1.75,
    //   zIndex: 2001,
    //   color: theme.COLORS.INFO,
    //   position: 'absolute',
    // },
    cardTitleTypeGreen: {
        color: "#00c537",
        paddingRight: 10,
    },

    hidediv: {
        display: "none",
    },
    showdiv: {
        display: "flex",
    },
    text: {
        paddingBottom: theme.SIZES.BASE,
        color: theme.COLORS.HEADER,
        marginTop: -10,
        fontSize: 15,
    },
    cardContainer: {
        backgroundColor: "#dedede",
        borderWidth: 0,
        //height: height < 500 ? height * 0.5 : height * 0.5,
        shadowColor: "#8898AA",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 6,
        shadowOpacity: 0.9,
        elevation: 20,
        textAlign: "center",
        paddingTop: 20,
        // eslint-disable-next-line no-dupe-keys
        marginBottom: 50,
        paddingBottom: 10,
    },

    info: {
        marginTop: 30,
        paddingHorizontal: 10,
        backgroundColor: "#4b4b4b",
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 8,
    },
    icons: {
        marginRight: -20,
        fontSize: 30,
    },
    iconstwo: {
        fontSize: 10,
        marginRight: 5,
        marginTop: 2,
    },
    Divider: {
        borderColor: "#fff",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingHorizontal: 20,
    },

    BoxSubTitle: {
        color: "#000",
        fontSize: 10,
        marginTop: 0,
        flexWrap: "nowrap",
    },
    Jobdetail: {
        borderWidth: 0,
    },
    dropdown1BtnStyle: {
        width: "100%",
        height: 30,
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
    },
    dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
    dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
    dropdown1RowStyle: {
        backgroundColor: "#FFF",
        borderBottomColor: "#C5C5C5",
        height: 30,
    },
    dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
    buttonView: {
        backgroundColor: "#2EA9A7",
        width: 90,
        height: 35,
        marginLeft: 25
    },
    buttonView1: {
        backgroundColor: "#2EA9A7",
        borderColor: '#2EA9A7',
        width: width/1.3,
        height: 33,
    },

    centerButton: {
        textAlign: "center",
    },
    NoRecordImage: {
        width: 200,
        height: 200,
    },
    ViewImage: {
        paddingTop: 90,
        textAlign: "center",
        backgroundColor: "#fff",
    },
    refreshBtn: {
        color: "#fff",
        fontSize: 13,
    },
    log: {
        backgroundColor: "#5fd27f",
        borderRadius: 50,
        width: 90,
        textTransform: "capitalize",
        height: 25,
        fontSize: 12,
        margin: 0,
    },
});

export default WaiverList;
