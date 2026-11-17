import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    BackHandler,
    Image,
    View,
    Modal,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text, theme } from "galio-framework";
import {
    CUSTOMERIMAGEFROM,
    STORAGE_DRIVERID,
    STORAGE_JOBID
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Foundation from "react-native-vector-icons/Foundation";
import { useFocusEffect } from "@react-navigation/native";
import { FlatGrid } from 'react-native-super-grid';
import { Linking } from "react-native";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const CustomerImagePage = ({ navigation, route, style }) => {
    const [images, setImages] = useState();
    const [showSpinner, setshowSpinner] = useState(false);
    const [issueLists, setIssueLists] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modelImage, setModelImage] = useState("");
    // const [customerId, setCustomerId] = useState(route?.params?.paramKey);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            handleCustomerImage();
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
    

    const handleImagePopUp = (path) => {
        setModelImage(path);
        setModalVisible(true);
    };

    const openAddress = (type, location) => {
        if (type == 1) {
            Linking.openURL(`${location}`);
        }
    };

    const handleCustomerImage = async () => {
        const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
        const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

        const json = {
            // DriverId: "R00285",
            // JobId: "354356"
            DriverId: driverid,
            JobId: JSON.parse(jobid),
        };

        console.log("jsonsssssssssssssssssssssssss", json)
        const maps = []
        try {
            setshowSpinner(true);
            axios
                .post(CUSTOMERIMAGEFROM + "GetCustomerImages", json, {
                    headers: {
                        Authorization:
                            "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log("resssdadadwsdass",response)
                    const responseList = response?.data;
                    setIssueLists(responseList);
                    if (responseList) {
                        responseList?.images?.forEach((item) => {
                            maps.push({ path: item.path });
                        });
                        setImages(maps);
                    }
                    setshowSpinner(false);
                })
                .catch((error) => {
                    console.log("API error", error);
                    setshowSpinner(false);

                })
                .finally(function () {
                    console.log("Finally Call");
                    setshowSpinner(false);

                });
        } catch (error) {
            console.log('Api Error', error);
            setshowSpinner(false);

        }
    };

    // Restrict Back button
       useEffect(() => {
              const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                  return true; // Prevent default back behavior
                }
              );
          
              return () => backHandler.remove();
            }, [navigation]);
      
    
    return (
        <SafeAreaWrapper>
        <Block flex style={{ backgroundColor: "#fff" }}>
            {showSpinner && <OverlaySpinner />}
            {/* <Block row style={styles.Headers}>
                <Block flex row>
                    <Text
                        style={styles.Joblisttitle}
                        color={theme.COLORS.SECONDARY}
                    >
                        Customer Images
                    </Text>
                </Block>
            </Block> */}

              <Block row style={styles.header}>
                    <TouchableOpacity 
                      onPress={() => {
                        navigation.goBack();
                      }}
                      style={styles.backButton}
                    >
                      <AntDesign name="arrowleft" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerTitle}>Customer Images</Text>
                    
            
                  </Block>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articles}
            >
                <Block style={styles.container}>
                    {!issueLists? (
                        <Block center style={styles.ViewImage}>
                            <Image
                                style={styles.NoRecordImage}
                                source={require("../../images/3371471.jpg")}
                            ></Image>
                            <Text>No Record Found</Text>
                        </Block>
                    ) : (
                        <Block>
                            <Block style={styles.cardContainerOne}>
                                <Block flex style={styles.CustomerdetailsOne}>
                                    <Block flex row>
                                        <Text
                                            size={14}
                                            style={styles.cardTitle}
                                            color={theme.COLORS.SECONDARY}
                                        >
                                            Job ID : {issueLists && issueLists?.jobId}
                                        </Text>
                                    </Block>

                                    <Block row>
                                        <Text
                                            size={14}
                                            style={styles.cardSubTitle}
                                            color={theme.COLORS.SECONDARY}
                                        >
                                            Customer Ref No. : {issueLists && issueLists?.driverId}
                                        </Text>
                                    </Block>
                                </Block>
                            </Block>
                             <Block style={styles.cardContainerOne}>
                                <Block flex style={styles.CustomerdetailsOne}>


                                    <Block row>
                                        <Text
                                            size={14}
                                            style={styles.cardSubTitle}
                                            color={theme.COLORS.SECONDARY}
                                        >
                                            <FontAwesome
                                                name="image"
                                                style={styles.iconstwo}
                                            /> Images :
                                        </Text>
                                    </Block>

                                    <Block style={{ flexDirection: "row" }}>
                                        <FlatGrid
                                            itemDimension={80}
                                            data={images}
                                            style={styles.gridView}
                                            spacing={10}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity activeOpacity={0.4}
                                                    onPress={() => handleImagePopUp(item.path)}
                                                >
                                                    <View style={[styles.itemContainer]}>
                                                        {item?.path && (
                                                            <Image
                                                            source={{
                                                                uri: item.path || "",
                                                            }}
                                                            style={styles.LogoAvatar}
                                                            resizeMode="contain"
                                                        />
                                                        )}
                                                        
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />

                                    </Block>

                                </Block>
                            </Block>

                            {issueLists && issueLists?.pdfs?.length > 0 && <Block style={styles.cardContainerOne}>
                                <Block flex style={styles.CustomerdetailsOne}>

                                    <Block row>
                                        <Text
                                            size={14}
                                            style={styles.cardSubTitle}
                                            color={theme.COLORS.SECONDARY}
                                        >
                                            <FontAwesome
                                                name="file-pdf-o"
                                                style={styles.iconstwo}
                                            />  Pdf Files :
                                        </Text>
                                    </Block>
                                    <Block flex>
                                        {issueLists && issueLists?.pdfs?.length > 0 && issueLists?.pdfs.map((item) => (
                                            <Text
                                                size={14}
                                                style={`${styles.ListTitleRight} ${styles.notes}`}
                                                onPress={() =>
                                                    openAddress(1, item.path)
                                                }
                                            >
                                                {item.path}
                                            </Text>

                                        ))}
                                    </Block>

                                </Block>
                            </Block>}
                            {issueLists && issueLists?.ppts?.length > 0 && <Block style={styles.cardContainerOne}>
                                <Block flex style={styles.CustomerdetailsOne}>

                                    <Block row>
                                        <Text
                                            size={14}
                                            style={styles.cardSubTitle}
                                            color={theme.COLORS.SECONDARY}
                                        >
                                            <AntDesign
                                                name="pptfile1"
                                                style={styles.iconstwo}
                                            /> Ppt Files :
                                        </Text>
                                    </Block>
                                    <Block flex>
                                        {issueLists && issueLists?.ppts?.length > 0 && issueLists?.ppts.map((item) => (
                                            <Text
                                                size={14}
                                               
                                                style={`${styles.ListTitleRight} ${styles.notes}`}
                                                color={theme.COLORS.SECONDARY}
                                                onPress={() =>
                                                    openAddress(1, item.path)
                                                }
                                            >
                                                {item.path}
                                            </Text>
                                        ))}
                                    </Block>

                                </Block>
                            </Block>}

                            {issueLists && issueLists?.docs?.length > 0 && <Block style={styles.cardContainerOne}>
                                <Block flex style={styles.CustomerdetailsOne}>

                                    <Block row>
                                        <Text
                                            size={14}
                                            style={styles.cardSubTitle}
                                            color={theme.COLORS.SECONDARY}
                                        >
                                            <Foundation
                                                name="page-doc"
                                                style={styles.iconstwo}
                                            /> Doc Files :
                                        </Text>
                                    </Block>
                                    <Block flex>
                                        {issueLists && issueLists?.docs?.length > 0 && issueLists?.docs.map((item) => (
                                            <Text
                                                size={14}
                                              
                                                style={`${styles.ListTitleRight} ${styles.notes}`}
                                                color={theme.COLORS.SECONDARY}
                                                onPress={() =>
                                                    openAddress(1, item.path)
                                                }
                                            >
                                                {item.path}
                                            </Text>
                                        ))}
                                    </Block>

                                </Block>
                            </Block>} 
                        </Block>
                        // ))
                    )}
                </Block>

                <Block>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image
                                    center
                                    source={{ uri: modelImage }}
                                    style={styles.modalImage}
                                    resizeMode="contain"

                                ></Image>
                                <TouchableOpacity activeOpacity={0.4}
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.modalClose}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </Block>
            </ScrollView>
        </Block>
        </SafeAreaWrapper>
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
        marginBottom: 10,
        paddingBottom: 0,
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

    modalImage: {
        height: height - 80,
        width: width - 25,
        borderRadius: 15,
    },

    BackIcon: {
        color: theme.COLORS.BLACK,
        fontSize: 20,
        fontWeight: "600",
        marginRight: 10,
    },
    Joblisttitle: {
        color: theme.COLORS.BLACK,
        fontSize: 16,
        fontWeight: "600",
        marginTop: 3,
    },
    CustomerdetailsOne: {
        padding: 7,
        borderLeftColor: "#000",
        borderLeftWidth: 2,
    },
    container: {
        paddingHorizontal: theme.SIZES.BASE,
        backgroundColor: "#fff",
        paddingTop: 10,
        width: width,
    },
    modalClose: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
    },
    cardTitle: {
        color: "#000",
        fontSize: 18,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    cardSubTitle: {
        color: "#A0A0A0",
        fontSize: 13,
        paddingLeft: 10,
        marginTop: 10
    },

    pdfSubTitle: {
        color: "#0095DF",
        fontSize: 12,
        marginTop: 0,
        flexWrap: "wrap",
        flexShrink: 1,
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

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        borderColor: 'red'
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 50,
        alignItems: "center",
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 50,
            height: 40,
        },
        shadowOpacity: 0.1,
        shadowRadius: 50,
        elevation: 5,
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
        fontSize: 13,
        marginRight: 5,
        color: "#FF002E"
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

    gridView: {
        textAlign: 'center',
        marginBottom: 20
    },

    itemContainer: {
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1,
        padding: 10,
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center'
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
        width: 50,
        height: 25,
    },
    centerButton: {
        textAlign: "center",
    },
    NoRecordImage: {
        width: 100,
        height: 150,
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
    LogoAvatar: {
        width: 50,
        height: 80,
        borderWidth: 0,
    },
    ListTitleRight: {
        color: "#848484",
        fontSize: 12,
        paddingBottom: 5,
    },
    notes: {
        color: "#0095DF",
        fontSize: 12,
        backgroundColor: "#fff",
        padding: 5,
        marginBottom: 10,
        borderRadius: 5,
        marginLeft: 10
    },
});

export default CustomerImagePage;

