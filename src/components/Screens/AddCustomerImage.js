import React, { useEffect, useState } from "react";

import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Input, Text, theme } from "galio-framework";
import ImagePicker from "react-native-image-crop-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URL,
  URLDRIVER,
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import { FlatGrid } from "react-native-super-grid";
import uuid from "react-native-uuid";
import SafeAreaWrapper from "../SafeAreaWrapper";
// var RNFS = require("react-native-fs");
// import RNFS from 'react-native-fs';

const { height, width } = Dimensions.get("window");

const AddCustomerImage = ({ navigation, route, style }) => {
  const [jobId, setJobId] = useState("");
  const [text, setOnChangeText] = React.useState("");
  const [updateState, setUpdateState] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [issueDrop, setIssueDrop] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSpinner, setshowSpinner] = useState(false);
  const [modelImage, setModelImage] = useState("");
  const [uniqueIds, setUniqueIds] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserDetails = (e, type) => {
    const value = e.nativeEvent.text;
    const data = {
      name: quote.name.toString(),
      email: quote.email.toString(),
    };
    if (type == 1) {
      data.name = value;
    } else if (type == 2) {
      data.email = value;
    }
    setQuote(data);
  };

  const handleImagePopUp = (path) => {
    setModelImage(path);
    setModalVisible(true);
  };

  useEffect(() => {
    let id = uuid.v4();
    setUniqueIds(id);
  }, [navigation]);

  useEffect(() => {
    const jobId = async () => {
      const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
      setJobId(JSON.parse(jobid));
    };
    jobId();
  }, []);

  useEffect(async () => {
    if (Platform.OS == "android") {
      const permissionAndroid = await PermissionsAndroid.check(
        "android.permission.CAMERA"
      );
      if (permissionAndroid != PermissionsAndroid.RESULTS.granted) {
        const reqPer = await PermissionsAndroid.request(
          "android.permission.CAMERA"
        );
        if (reqPer != "granted") {
          // navigation.goBack();
          return false;
        }
      }
    }
  }, []);

  const handleIssue = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
    };
    let map = [];
    try {
      axios
        .post(URLDRIVER + "GetIssues", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response.data;
          if (responseData) {
            // map.push({ issue: "please select", issueId: 0 });
            responseData.forEach((item) => {
              // map.push({ issue: item.issue, issueId: item.issueId });
              map.push({ issue: item.Issue, issueId: item.IssueId });
            });
            setIssueDrop(map);
          }
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      console.log(error);
      //  setshowSpinner(false);
    }
  };

  // Save Job Delivery Images 
  const handleSaveImage = async () => {
    try {
      // 1. Get required IDs
      const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
      const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
      setshowSpinner(true);
      const uniqueID=uuid.v4();
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('DriverId', driverid);
      formData.append('JobId', JSON.parse(jobid));
      formData.append('UniqueKey',uniqueID );
      formData.append('Remarks', text);

      // check image
      if(!updateState.length){
        alert(`Upload Issue Image OR Capture Issue Image! `);
        return;
      }
      // 3. Process images if they exist
      if (updateState?.length > 0) {
        await Promise.all(
          updateState.map(async (image, index) => {
            if (!image?.uri) return;
            
            try {
              // Get filename
              const filename = image.uri.split('/').pop() || `image_${Date.now()}_${index}.jpg`;
              // Add to form data
              formData.append('Del_Images[]', {
                uri: image?.uri,
                type: image.mime || 'image/jpeg',
                name: filename,
              });
            } catch (e) {
              // Fallback to original if compression fails
              formData.append('Del_Images[]', {
                uri: image.uri,
                type: image.mime || 'image/jpeg',
                name: image.uri.split('/').pop() || `image_${Date.now()}_${index}.jpg`,
              });
            }
          })
        );
      }
  
      console.log("imppppppppppp",{formData});
  
      const IssueImageURL=`${URLDRIVER}AddCustomerImages`
      // 5. Upload images
    const uploadresponse=  await axios.post(IssueImageURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
        },
      });
      console.log("Upload:::::::::::::",uploadresponse);
      Alert.alert(
        'Success',
        'Submited successfully!',
        [
          {
            text: 'OK',
            onPress: handleOkPress,
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setshowSpinner(false);
      setUniqueIds("");
    }
  };

  const handleOkPress=()=>{
    navigation.navigate("SendCashConfirmation");
  }
  // Save Action
  const handleSave = async () => {
    handleSaveImage();
  };

  useEffect(() => {
    handleIssue();
  }, []);

  const handleRedirectConfirmationScreen = () => {
    navigation.navigate("SendCashConfirmation");
  };

  
  // Open Camera Handler
  const handleOpenCamera = () => {
      setIsLoading(true);
      const options = {
        mediaType: "photo",
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
        saveToPhotos: true,
        includeBase64: false, // Ensure we don't get base64 data
      };
    
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
          setIsLoading(false);
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
          setIsLoading(false);
        } else if (response.customButton) {
          alert(response.customButton);
          setIsLoading(false);
        } else {
          if (response.assets) {
            const responseData = response.assets[0];
            // Store just the URI and other metadata
            setUpdateState((prev) => [
              ...prev, 
              {
                uri: responseData.uri,
                width: responseData.width,
                height: responseData.height,
                type: responseData.type,
                fileName: responseData.fileName
              }
            ]);
            
            setSelectedImage(responseData.uri);
            setIsLoading(false);
          }
        }
      });
    };

    // Image Library Handler
  const handleImageLibery = () => {
    setIsLoading(true);
    if (ImagePicker && ImagePicker?.openPicker) {
      ImagePicker.openPicker({
        width: 800,
        height: 800,
        compressImageQuality: 0.5,
        includeBase64: false, // Don't include base64
        multiple: true,
      })
      .then((images) => {
        // Use the path/URI directly instead of base64
        const newImages = images.map((image) => ({
          uri: image.path, // Use the actual file path
          width: image.width,
          height: image.height,
          mime: image.mime,
        }));
  
        setUpdateState((prev) => [...prev, ...newImages]);
      })
      .catch((error) => {
        console.error("Image Picker Error: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };
  // Remove IMage Handler
  const handleRemoveImage = (index) => {
    setUpdateState(prev => prev.filter((_, i) => i !== index));
  };

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
    <Block>
      {showSpinner && <OverlaySpinner />}
      <Block row style={styles.Headers}>
              <Block flex row>
                <Text
                  style={styles.BackText}
                 >
                </Text>
                <Text
                  style={styles.Joblisttitle}
                  color="#fff"
                >
                   Job Id: {jobId} 
                </Text>
              </Block>
            </Block>
            
      <Block style={styles.container}>

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1,paddingBottom: 80 }}
          style={{ flex: 1 }}
        >

          <Block style={styles.SectionOneMain}>
            <Block style={styles.SectionOne}>
              
              <Block style={{ marginBottom: 10 }}>
                <Block flex left style={styles.wi50}>
                  <Text style={styles.Tips1}> Please upload photos of Job</Text>
                  <Text style={styles.Tips2}> Tips </Text>
                  <Text style={styles.TipsBullet}> - Show all products </Text>
                  <Text style={styles.TipsBullet}>
                    {" "}
                    - Take background to show the surroundings{" "}
                  </Text>
                </Block>
              </Block>
            </Block>

            <Block style={styles.SectionOne}>
              <Block>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ fontFamily: "montserrat-regular" }}
                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // style={styles.Text}
                  color={theme.COLORS.SECONDARY}
                >
                  Select Delivery Image
                </Text>
              </Block>

              <Block>
                {/* <View style={{ flex: 1 }}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#3498DB" />
                  ) : (
                    <FlatGrid
                      itemDimension={80}
                      data={updateState}
                      style={styles.gridView}
                      spacing={10}
                      renderItem={({ item }) => (
                        <TouchableOpacity activeOpacity={0.4}>
                          <View style={[styles.itemContainer]}>
                            <Image
                              source={{
                                uri: `data:image/png;base64,${item.data}`,
                              }}
                              style={styles.LogoAvatar}
                              resizeMode="contain"
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View> */}

                <View style={{ flex: 1 }}>
                                  {isLoading ? (
                                    <OverlaySpinner />
                                  ) : (
                                    <FlatGrid
                                    itemDimension={80}
                                    data={updateState}
                                    style={styles.gridView}
                                    spacing={10}
                                    renderItem={({ item, index }) => (
                                      <TouchableOpacity activeOpacity={0.4}>
                                        <View style={[styles.itemContainer]}>
                                          <View style={{ position: 'relative' }}>
                                            <Image
                                              source={{ uri: item.uri }} // Use the URI directly
                                              style={styles.LogoAvatar}
                                              resizeMode="cover"
                                            />
                                            <TouchableOpacity 
                                              style={styles.clearIcon}
                                              onPress={() => handleRemoveImage(index)}
                                            >
                                              <Icon name="times-circle" size={20} color="#ff0000" />
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                  />
                                  )}
                                </View>
              </Block>
            </Block>

            <Block style={styles.info}>
              <Block row space="around">
                <Block middle style={styles.btnSection}>
                  <TouchableOpacity onPress={handleOpenCamera}>
                    <Text style={styles.btnText}>
                      <FontAwesome
                        size={20}
                        style={{ color: "white" }}
                        color={theme.COLORS.ICON}
                        name="camera"
                        family="NowExtra"
                      />
                    </Text>
                    <Text
                      style={{ fontFamily: "montserrat-regular" }}
                      size={14}
                      color="white"
                    >
                      Camera
                    </Text>
                  </TouchableOpacity>
                </Block>

                <Block middle style={styles.btnSection}>
                  <TouchableOpacity onPress={handleImageLibery}>
                    <Text style={styles.btnText}>
                      <FontAwesome
                        size={20}
                        style={{ color: "white" }}
                        color={theme.COLORS.ICON}
                        name="image"
                        family="NowExtra"
                      />
                    </Text>
                    <Text
                      style={{ fontFamily: "montserrat-regular" }}
                      size={14}
                      color="white"
                    >
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </Block>
              </Block>
            </Block>

            <Block style={styles.SectionOneFour}>
              <Block>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ fontFamily: "montserrat-regular" }}
                  size={14}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // style={styles.Text}
                  color={theme.COLORS.SECONDARY}
                >
                  Driver Notes
                </Text>
              </Block>

              <Block flex right style={styles.wi50}>
                <Input
                  style={styles.ListTitleRight1}
                  placeholder="Driver Notes"
                  value={text}
                  placeholderTextColor={"#8898AA"}
                  onChangeText={setOnChangeText}
                  multiline={true}
                  numberOfLines={5}
                  name="Enter Customer Reference Number"
                  shadowless
                />
              </Block>
            </Block>
          </Block>
          <Block row style={styles.CustomerdetailsOne}>
            <Block flex>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
                small
                center
                color="success"
                style={styles.optionsButtonClear}
                onPress={handleRedirectConfirmationScreen}
              >
                Skip
              </Button>
            </Block>

            <Block flex right>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
                small
                center
                color="success"
                style={styles.optionsButtonSave}
                onPress={handleSave}
              >
                Save
              </Button>
            </Block>
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
                    source={{ uri: `data:image/png;base64,${modelImage}` }}
                    style={styles.modalImage}
                  ></Image>
                  <TouchableOpacity
                    activeOpacity={0.4}
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
        </View>
      </Block>
    </Block>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    width: width,
    height: height,
  },
  clearIcon: {
    position: 'absolute',
    top: -5,
    right: -20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  
  Headers: {
    backgroundColor: "#3498DB",
    padding: 15,
  },
  BackText: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
  BackIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  Joblisttitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalImage: {
    height: height - 80,
    width: width - 25,
    borderRadius: 15,
  },
  modalClose: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  Headers: {
    backgroundColor: "#3498DB",
    padding: 15,
  },
  BackText: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
  BackIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  Joblisttitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  Text: {
    color: "#000",
    paddingBottom: 5,
    fontWeight: "600",
    fontSize: 14,
  },
  Text2: {
    color: "#000",
    paddingBottom: 5,
    fontWeight: "600",
    fontSize: 18,
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
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  dropDownBrand: {
    paddingRight: 120,
  },
  SectionOneMain: {
    backgroundColor: "#fff",
    marginBottom: 15,
    marginTop: 15,
    padding: 0,
  },

  SectionOne: {
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 0,
  },

  SectionOneFour: {
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 15,
    color: "#000",
    marginTop: 0,
  },
  AddIssue: {
    marginTop: 10,
    color: "#000",
  },
  log: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 70,
    textTransform: "capitalize",
    height: 30,
  },
  btnText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    fontWeight: "bold",
  },
  JobButton: {
    // position: 'absolute',
    width: width,
    bottom: 0,
    textAlign: "center",
    paddingBottom: 10,
    marginBottom: 50,
  },
  ImageSections: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
  },
  JobButton1: {
    width: width,
    bottom: 0,
    textAlign: "center",
    paddingBottom: 10,
    marginBottom: 50,
  },
  optionsButtonClear: {
    backgroundColor: "#181818",
    borderRadius: 10,
  },
  optionsButtonSave: {
    backgroundColor: "#5fd27f",
    borderRadius: 10,
  },
  optionsButtonFinish: {
    backgroundColor: "#246afd",
    borderRadius: 10,
  },
  Skip: {
    //backgroundColor: '#f1f1f1',
    marginBottom: 170,
    marginTop: 15,
  },
  ListTitleRight: {
    paddingRight: 160,
  },
  ListTitleRight1: {
    height: 80,
  },
  FontAwesome: {
    marginLeft: 290,
    color: "#000",
  },
  btnSection: {
    width: 80,
    //height: 40,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    margin: 5,
    padding: 10,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    marginTop: 10,
    marginBottom: 10,
  },
  // dropdown1BtnTxtStyle: { textAlign: "left", color: "black" },
  // dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  // dropdown1RowStyle: { backgroundColor: "#FFF", borderBottomColor: "#C5C5C5" },
  // dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#FFF",
    borderBottomColor: "#C5C5C5",
    height: 30,
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  icons: {
    marginRight: -20,
    fontSize: 30,
    flexWrap: "wrap",
    flex: 1,
  },
  wi50: {
    marginTop: -5,
  },

  gridView: {
    textAlign: "center",
    marginBottom: 50,
  },

  itemContainer: {
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    elevation: 1,
    padding: 10,
    display: "flex",
    textAlign: "center",
    alignItems: "center",
  },

  LogoAvatar: {
    width: 50,
    height: 50,
    borderWidth: 0,
  },

  Tips1: {
    marginTop: 13,
  },

  Tips2: {
    marginTop: 7,
  },

  TipsBullet: {
    paddingLeft: 10,
  },

  centerText: {
    textAlign: "center",
  },
});

export default AddCustomerImage;
