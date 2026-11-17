import React, { useState, useEffect } from "react";

import axios from 'axios';

import { Dimensions, StyleSheet, ScrollView, BackHandler, View } from "react-native";

import { Block, Button, Text, theme } from "galio-framework";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    STORAGE_JOBID,
    STORAGE_USEREMAIL,
    URL,
    STORAGE_DRIVERID,
    STORAGE_SUM,
    STORAGE_NAME,
    STORAGE_VIEW,
    STORAGE_SIGN,
    STORAGE_SIGNATURE,
    STORAGE_ISSUEID,
    STORAGE_PERSONNAME,
    // STORAGE_TOKEN,
    STORAGE_REDIRECTIONATJOBLISTPAGE
} from "../../utils/factory";

import { useFocusEffect } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const LogoutPage = ({ navigation, route, style }) => {

    const [jobIds, setJobIds] = useState();

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

    useEffect(() => {
        const handleJobData = async () => {
            try {
                const values = await AsyncStorage.getItem(STORAGE_JOBID);
                if (values !== null) {
                    // We have data!!
                    setJobIds(JSON.parse(values));
                }
            } catch (error) {
                alert("please try again");
            }
        };
        handleJobData();
    }, []);


    const handleLogout = async () => {
        const useremail = await AsyncStorage.getItem(STORAGE_USEREMAIL)
        const json = {
            EmailId: useremail,
        };

        try {
            axios
                .post(URL + "DriverLogout", json, {
                    headers: {
                        Authorization:
                            "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
                        "Content-Type": "application/json",
                    },
                })

                .then((response) => {
                    AsyncStorage.removeItem(STORAGE_USEREMAIL);
                    AsyncStorage.removeItem(STORAGE_DRIVERID)
                    // AsyncStorage.removeItem(STORAGE_JOBID)
                    // AsyncStorage.removeItem(STORAGE_SUM)
                    // AsyncStorage.removeItem(STORAGE_VIEW)
                    // AsyncStorage.removeItem(STORAGE_NAME)
                    // AsyncStorage.removeItem(STORAGE_SIGN)
                    // AsyncStorage.removeItem(STORAGE_SIGNATURE)
                    // AsyncStorage.removeItem(STORAGE_ISSUEID)
                    // AsyncStorage.removeItem(STORAGE_PERSONNAME)
                    // AsyncStorage.removeItem(STORAGE_TOKEN)
                    // AsyncStorage.removeItem(STORAGE_REDIRECTIONATJOBLISTPAGE)
                    navigation.navigate("LoginPage");

                })
                .catch((error) => {
                    setNotFound(false);
                    console.log("API error", error);
                })
                .finally(function () {
                    console.log("Finally Call");
                    setshowSpinner(false);
                });
        } catch (error) {
            console.log(error);
            setshowSpinner(false);
        }
    };

    const handleRedirectJobList = (id) => {
        if (id == 2) {
            navigation.navigate("Dashboard");
        }
    };

    return (
        <Block style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articles}
            >
                <Block style={styles.MiddleContainer}>
                    <Block style={styles.SectionOne}>
                        <Block>
                            <Text
                                style={{ fontFamily: "montserrat-regular" }}
                                size={16}
                                // style={styles.Text}
                                color={theme.COLORS.SECONDARY}
                            >
                                <Block left>
                                    <Button
                                        round
                                        onlyIcon
                                        icon="exclamation"
                                        iconFamily="Font-Awesome"
                                        iconColor="#e74c3c"
                                        iconSize={theme.SIZES.BASE * 1.5}
                                        color={"#fff"}
                                    />
                                </Block>
                            </Text>

                            <Text
                                style={{ fontFamily: "montserrat-regular" }}
                                size={16}
                                // style={styles.Text1}
                                color={theme.COLORS.SECONDARY}
                            >
                                You Sure, that you want to logout
                            </Text>
                        </Block>
                    </Block>

                    <Block row style={styles.JobButton}>
                        <View style={{ marginTop: 20 }}>
                            <Block row>
                                <Block>
                                    <Button style={styles.Button} round
                                        onPress={() => handleRedirectJobList(2)}
                                    >
                                        <Text
                                            style={{ fontFamily: "Montserrat-Regular" }}
                                            size={10}
                                            color="#fff"
                                        >
                                            BACK
                                        </Text>
                                    </Button>
                                </Block>

                                <Block>
                                    <Button style={styles.Button} round
                                        onPress={handleLogout}
                                    >
                                        <Text
                                            style={{ fontFamily: "Montserrat-Regular" }}
                                            size={10}
                                            color="#fff"
                                        >
                                            CONFIRM
                                        </Text>
                                    </Button>
                                </Block>
                            </Block>
                        </View>

                    </Block>
                </Block>
            </ScrollView>
        </Block>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.SIZES.BASE,
        backgroundColor: "#fff",
        width: width,
        height: height,
    },
    MiddleContainer: {
        marginTop: 250,
        textAlign: "center",
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: "#DADADA",
    },
    Text: {
        color: "#000",
        marginTop: 25,
        textAlign: "center",
        paddingLeft: 7,
        paddingRight: 7,
        fontSize: 20,
        fontWeight: "bold",
    },
    Text1: {
        color: "#000",
        textAlign: "center",
        paddingLeft: 7,
        paddingRight: 7,
    },
    Text2: {
        color: "#000",
        marginTop: 15,
        textAlign: "center",
        paddingLeft: 7,
        paddingRight: 7,
        fontWeight: "bold",
    },
    TextTwo: {
        color: "#000",
        paddingBottom: 10,
    },
    Amount: {
        padding: 10,
        borderColor: "#f1f1f1",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 10,
        color: "#000",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    SectionOne: {
        //backgroundColor: '#f1f1f1',
        marginBottom: 15,
        marginTop: 0,
    },
    cardTitle: {
        fontSize: 15,
        color: "#000",
        marginTop: 0,
    },
    log: {
        backgroundColor: "#5fd27f",
        borderRadius: 50,
        width: 70,
        textTransform: "capitalize",
        height: 30,
    },
    JobButton: {
        width: width,
        bottom: 0,
        textAlign: "center",
        marginBottom: 15,
        marginLeft: 20
    },
    optionsButtonStart: {
        backgroundColor: "#5fd27f",
        borderRadius: 10,
    },
    optionsButtonFinish: {
        backgroundColor: "#246afd",
        borderRadius: 10,
    },
    Button: {
        width: 130,
        height: 30,
        marginHorizontal: 5,
        elevation: 0,
        backgroundColor: "#109DE7",
        fontFamily: "Montserrat-Regular",
    },
});

export default LogoutPage;
