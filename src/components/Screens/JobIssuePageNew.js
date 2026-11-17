import React, { useEffect, useRef, useState } from "react";
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
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Modal,
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block, Button, Input, Text, theme } from "galio-framework";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URL,
  URLDRIVER,
} from "../../utils/factory";
// import Select2 from "react-native-select-two";
import ImagePicker from "react-native-image-crop-picker";
// import SelectDropdown from "react-native-select-dropdown";
// import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from "react-native-vector-icons/AntDesign";

import { OverlaySpinner } from "../../utils/Spinner";
import { FlatGrid } from "react-native-super-grid";
import uuid from "react-native-uuid";
// var RNFS = require("react-native-fs");
// import RNFS from 'react-native-fs';
import CustomSelect from "./CustomSelect";
// import ImageCompressor from 'react-native-image-compressor';
import SelectSkeleton from "../SelectSkeleton";
import SafeAreaWrapper from "../SafeAreaWrapper";
const uniqueId = uuid.v4();
const { height, width } = Dimensions.get("window");


const JobIssuePageNew = ({ navigation, route, style }) => {
  const [jobId, setJobId] = useState("");
  const [text, setOnChangeText] = React.useState("");
  const [updateState, setUpdateState] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [issueDrop, setIssueDrop] = useState([]);
  // const [solutionsDrop, setSolutionsDrop] = useState([]);
  const [issueAjax, setIssueAjax] = useState();
  const [selectItem, setSelectItem] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [showSpinner, setshowSpinner] = useState(false);
  const [customerRefNo, setCustomerRefNo] = useState(route.params.paramKey);
  const [isLoading, setIsLoading] = useState(false);

  const [uniqueIds, setUniqueIds] = useState("");

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [solutionsDrop, setSolutionsDrop] = useState([]);

  const [loadingIssues, setLoadingIssues] = useState(false);
const [loadingSolutions, setLoadingSolutions] = useState(false);

  // const [modalVisible, setModalVisible] = useState(false);


 // Refs for handling scroll and input focus
 const scrollViewRef = useRef();
 const textInputRef = useRef();

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
    setLoadingIssues(true)
    setshowSpinner(true)
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
    };
    let map = [];
    const Url=`${URLDRIVER}GetIssues`
    // console.log("uuuuuuuuuuuuuuuuuuuuuuuuuu",Url);
    try {
      axios
        .post(Url, json, {
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
              map.push({ issue: item.Issue, issueId: item.IssueId });
            });
            setIssueDrop(map);
            setLoadingIssues(false)
            setshowSpinner(false)
          }
        })
        .catch((error) => {
          setLoadingIssues(false)
          setshowSpinner(false)
          console.log("API error", error);
        })
        .finally(function () {
          setLoadingIssues(false)
          setshowSpinner(false)
          // always executedr
        });
    } catch (error) {
      setLoadingIssues(false)
      setshowSpinner(false)
      console.log(error);
      //  setshowSpinner(false);
    }
  };


  const handleSolutions = async (id) => {
    setshowSpinner(true)
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
      IssueId: id,
    };
   if(driverid && id){
    let map = [];
    try {
      const textURL=`${URLDRIVER}GetIssuesSolutions`
      console.log("dddddsddduuuuuuuuu",textURL);
     await  axios
        .post(textURL, json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response.data;
          console.log("sdddddddddddddddd",responseData);
          if (responseData) {
            // map.push({ id: 0, name: "please select" });
            responseData.forEach((item) => {
              map.push({ id: item.id, name: item.name });
            });
            setSolutionsDrop(map);
          setshowSpinner(false)

          }
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          setshowSpinner(false)
          // always executedr
        });
    } catch (error) {
      setshowSpinner(false)

      console.log(error);
    }
  }
  };


  const clearIssueForm=()=>{
    setIssueAjax(null)
    setSelectedSolution(null)
    setUpdateState([])
    setOnChangeText("")
  }


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

    // check image
    if(!issueAjax){
      alert(`Select the issue!`);
      return;
    }

    // check image
    if(!selectedSolution){
      alert(`Select the issue solution!`);
      return;
    }

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
            formData.append('Images[]', {
              uri: image?.uri,
              type: image.mime || 'image/jpeg',
              name: filename,
            });
          } catch (e) {
            // Fallback to original if compression fails
            formData.append('Images[]', {
              uri: image.uri,
              type: image.mime || 'image/jpeg',
              name: image.uri.split('/').pop() || `image_${Date.now()}_${index}.jpg`,
            });
          }
        })
      );
    }

    // 4. Prepare other data
    const jsonData = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
      RefNo: customerRefNo,
      IssueType: issueAjax,
      Solution: selectedSolution,
      UniqueKey: uniqueID,
      Desc: text,
    };


    console.log("imppppppppppp",{jsonData,formData});

    const IssueImageURL=`${URLDRIVER}AddIssueImage`
    // 5. Upload images
  const uploadresponse=  await axios.post(IssueImageURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
      },
    });
    console.log("Upload:::::::::::::",uploadresponse);
     const AddIssueURL=`${URLDRIVER}AddIssue`
    // 6. Upload other data
    await axios.post(AddIssueURL, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
      },
    });

    // 7. Handle success
    Alert.alert(
      'Success',
      'Issue Raised successfully!',
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


const handleOkPress = () => {
  clearIssueForm();
  redirectAction();
};

const redirectAction = () => {
  navigation.navigate('IssueListPage');
};

  const handleSave = async () => {
    handleSaveImage();
  };

  useEffect(() => {
    handleIssue(); //comment for while time
  }, []);


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


  // Remove IMage
  const handleRemoveImage = (index) => {
    setUpdateState(prev => prev.filter((_, i) => i !== index));
  };

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

// Handle keyboard appearance for driver notes
const handleDriverNotesFocus = () => {
  // Scroll to the bottom when the text input is focused
  scrollViewRef.current?.scrollToEnd({ animated: true });
};

  console.log("******************************4", updateState);
console.log("dddddddddddddddddddddd",issueDrop);
console.log("IMG",updateState);

const handleClear=()=>{
  setUpdateState([])
  setOnChangeText("")
  setIssueDrop([])
  setSelectedIssue(null)
  setSolutionsDrop([]);
  setSelectedSolution(null);

}


  return (
    <SafeAreaWrapper>
     <Block flex style={styles.container}>
      {showSpinner && <OverlaySpinner />}
     
      {/* Header */}
      <Block row style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate("JobDetails", {
              paramKey: jobId && jobId,
            });
          }}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}> Add Issue</Text>
        

      </Block>
     <ScrollView
             showsVerticalScrollIndicator={false}
             contentContainerStyle={styles.scrollContent}
           >
      {/* Main Content */}
              <Block style={styles.contentContainer}>
                {/* Job Info Card */}
      
          <Block style={styles.contentContainer}>
          <Block style={styles.SectionOneMain}>
              <Block style={[styles.card,{padding:15}]}>
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
                  Job Id
                </Text>
              </Block>

              <Block>
                <Block flex right style={styles.wi50}>
                  <Input
                    style={styles.ListTitleRight}
                    placeholder="Enter Job Id"
                    placeholderTextColor={"#8898AA"}
                    value={jobId}
                    name="name"
                    editable={false}
                    onChange={(e) => handleUserDetails(e, 1)}
                    shadowless
                    iconContent={
                      <FontAwesome
                        size={12}
                        color={theme.COLORS.ICON}
                        family="NowExtra"
                      />
                    }
                  />
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
                  Customer Reference No.
                </Text>
              </Block>

              <Block flex right style={styles.wi50}>
                <Input
                  style={styles.ListTitleRight}
                  placeholder="Enter Your Email Id"
                  value={customerRefNo ? customerRefNo : "N/A"}
                  placeholderTextColor={"#8898AA"}
                  editable={false}
                  onChange={(e) => handleUserDetails(e, 2)}
                  name="Enter Customer Reference Number"
                  shadowless
                  iconContent={
                    <FontAwesome
                      size={12}
                      color={theme.COLORS.ICON}
                      family="NowExtra"
                    />
                  }
                />
              </Block>
            </Block>
              <Block style={styles.SectionOne}>
                <Block>
                  <Text
                    style={{ fontFamily: 'montserrat-regular' }}
                    size={14}
                    color={theme.COLORS.SECONDARY}
                  >
                    Select Issue
                  </Text>
                </Block>

                <Block flex>
                  {loadingIssues ? (
                  <SelectSkeleton
                />
                  ) : (
                    <CustomSelect
                      data={
                        issueDrop?.map((item) => ({
                          label: item?.issue,
                          value: item?.issueId,
                        })) || []
                      }
                      selectedValue={selectedIssue}
                      onSelect={(item) => {
                        setSelectedIssue(item);
                        if (item) {
                          setIssueAjax(item.value);
                          setLoadingSolutions(true); // Show loader for solutions
                          handleSolutions(item.value).finally(() => {
                            setLoadingSolutions(false); // Hide loader when done
                          });
                        } else {
                          setSolutionsDrop([]);
                          setSelectedSolution(null);
                        }
                      }}
                      placeholder="Select issue"
                      searchable
                      clearable
                      disabled={true}  // Will show disabled state
                      loading={false}
                    />
                  )}
                </Block>
              </Block>

              <Block style={styles.SectionOne}>
                <Block>
                  <Text
                    style={{ fontFamily: 'montserrat-regular' }}
                    size={14}
                    color={theme.COLORS.SECONDARY}
                  >
                    Select Solution
                  </Text>
                </Block>


                <Block flex>
                  {loadingSolutions ? (
                  <SelectSkeleton
                />
                  ) : (
                    <CustomSelect
                      data={
                        solutionsDrop?.map((item) => ({
                          label: item?.name,
                          value: item?.id,
                        })) || []
                      }
                      selectedValue={selectedSolution}
                      onSelect={(item) => {
                        setSelectedSolution(item);
                      }}
                      placeholder={solutionsDrop.length ? "Select solution" : "Select solution"}
                      searchable
                      clearable
                      // disabled={!solutionsDrop.length}
                      disabled={true}  // Will show disabled state
                      loading={false}
                    />
                  )}
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
                  
                  placeholder="Driver Notes"
                  value={text}
                  placeholderTextColor={"#8898AA"}
                  onChangeText={setOnChangeText}
                  multiline={true}
                  style={styles.notesInput}
                  name="Enter Customer Reference Number"
                  shadowless
                  onFocus={handleDriverNotesFocus}
                    // blurOnSubmit={false}
                />

                
              </Block>

            </Block>
              </Block>

              <Block style={[styles.card,{padding:15}]}>
           
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
                  Select Issue Image
                </Text>
              </Block>

              <Block>
                {/* {renderFileData()} */}

                <View style={{ flex: 1 }}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#3498DB" />
                  ) : (
                    <FlatGrid
                    itemDimension={80}
                    data={updateState}
                    style={styles.gridView}
                    spacing={10}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                      onPress={() => {
                        setSelectedImage(item.uri);
                        setModalVisible(true);
                      }}
                      activeOpacity={0.4}>
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

              {/* Image Section */}
             <Block row space="around" style={styles.imageButtons}>
                <Block middle style={styles.btnSection}>
                  <TouchableOpacity  style={styles.imageButton} onPress={handleOpenCamera}>
                    <Text >
                      <FontAwesome
                        size={20}
                        style={{ color: "white" }}
                        color={theme.COLORS.ICON}
                        name="camera"
                        family="NowExtra"
                      />
                    </Text>
                    <Text
                       style={styles.imageButtonText} 
                      size={14}
                      color="white"
                    >
                      Camera
                    </Text>
                  </TouchableOpacity>
                </Block>

                <Block middle style={styles.btnSection}>
                  <TouchableOpacity  style={styles.imageButton} onPress={handleImageLibery}>
                    <Text  style={styles.imageButtonText} >
                      <FontAwesome
                        size={20}
                        style={{ color: "white" }}
                        color={theme.COLORS.ICON}
                        name="image"
                        family="NowExtra"
                      />
                    </Text>
                    <Text
                      style={styles.imageButtonText}  
                      size={14}
                      color="white"
                    >
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </Block>
              </Block>
            

         
            </Block>

          </Block>


          {/* <Block flex>
            <Block style={styles.JobButton1}></Block>
            <Block right style={styles.JobButton}></Block>
          </Block> */}
          </Block>
       
      </Block>
      </ScrollView>
      <Block style={styles.saveButtonContainer}>
            <Block style={styles.ButtonBoxContainer}>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
                small
                center

                color="danger"
                style={styles.optionsButtonClear}
                onPress={() =>handleClear()}
              >
                Clear
              </Button>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 15 }}
                small
                center
                color="#3498DB"
                style={styles.optionsButtonSave}
                onPress={handleSave}
              >
                Save
              </Button>
            </Block>

            
          </Block>

             {/* Image Preview Modal */}
                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableOpacity 
                        style={styles.modalCloseButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.modalCloseText}>✕</Text>
                      </TouchableOpacity>
                      
                      <Image
                        source={{ uri: selectedImage }}
                        style={styles.modalImage}
                        resizeMode="contain"
                      />
                    </View>
                  </Modal>

   </Block>
   </SafeAreaWrapper>
  );
};


const styles = StyleSheet.create({
  // container1: {
  //   padding: 20,
  //   paddingBottom: 150, // Prevent dropdown cutoff at bottom
  // },
  // clearIcon: {
  //   position: 'absolute',
  //   top: -5,
  //   right: -20,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   padding: 2,
  // },
  // LogoAvatar: {
  //   width: '100%',
  //   height: 80,
  // },
  // itemContainer: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // container: {
  //   paddingHorizontal: theme.SIZES.BASE,
  //   backgroundColor: "#fff",
  //   width: width,
  //   height: height,
  // },
  // Headers: {
  //   backgroundColor: "#3498DB",
  //   padding: 15,
  // },
  // BackText: {
  //   color: theme.COLORS.BLACK,
  //   fontSize: 20,
  //   fontWeight: "600",
  //   marginRight: 10,
  //   paddingTop: 5,
  // },
  // BackIcon: {
  //   color: "#fff",
  //   fontSize: 25,
  //   fontWeight: "800",
  //   marginRight: 10,

  // },
  // Joblisttitle: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginTop: 3,
  // },
  // input: {
  //   height: 40,
  //   margin: 12,
  //   borderWidth: 1,
  //   padding: 10,
  // },
  // Text: {
  //   color: "#000",
  //   paddingBottom: 5,
  // },
  // TextTwo: {
  //   color: "#000",
  //   paddingBottom: 10,
  // },
  // Amount: {
  //   padding: 10,
  //   borderColor: "#f1f1f1",
  //   borderWidth: 1,
  //   borderStyle: "solid",
  //   borderRadius: 10,
  //   color: "#000",
  //   fontSize: 15,
  //   fontWeight: "bold",
  //   textAlign: "center",
  // },
  // dropDownBrand: {
  //   paddingRight: 120,
  // },
  // SectionOneMain: {
  //   backgroundColor: "#fff",
  //   marginBottom: 15,
  //   marginTop: 15,
  //   padding: 0,
  // },

  // SectionOne: {
  //   backgroundColor: "#fff",
  //   marginBottom: 10,
  //   marginTop: 0,
  // },

  // SectionOneFour: {
  //   backgroundColor: "#fff",
  //   marginBottom: 10,
  //   marginTop: 20,
  // },
  // cardTitle: {
  //   fontSize: 15,
  //   color: "#000",
  //   marginTop: 0,
  // },
  // AddIssue: {
  //   marginTop: 10,
  //   color: "#000",
  // },
  // log: {
  //   backgroundColor: "#5fd27f",
  //   borderRadius: 50,
  //   width: 70,
  //   textTransform: "capitalize",
  //   height: 30,
  // },
  // btnText: {
  //   textAlign: "center",
  //   color: "gray",
  //   fontSize: 14,
  //   fontWeight: "bold",
  // },
  // JobButton: {
  //   // position: 'absolute',
  //   width: width,
  //   bottom: 0,
  //   textAlign: "center",
  //   paddingBottom: 10,
  //   marginBottom: 50,
  // },
  // ImageSections: {
  //   display: "flex",
  //   flexDirection: "row",
  //   paddingHorizontal: 8,
  //   paddingVertical: 8,
  //   justifyContent: "center",
  // },
  // JobButton1: {
  //   width: width,
  //   bottom: 0,
  //   textAlign: "center",
  //   paddingBottom: 10,
  //   marginBottom: 50,
  // },
  // optionsButtonClear: {
  //   backgroundColor: "#181818",
  //   borderRadius: 10,
  // },
  // optionsButtonSave: {
  //   backgroundColor: "#5fd27f",
  //   borderRadius: 10,
  // },
  // optionsButtonFinish: {
  //   backgroundColor: "#246afd",
  //   borderRadius: 10,
  // },
  // Skip: {
  //   //backgroundColor: '#f1f1f1',
  //   marginBottom: 170,
  //   marginTop: 15,
  // },
  // ListTitleRight: {
  //   paddingRight: 160,
  // },
  // ListTitleRight1: {
  //   height: 80,
  // },
  // FontAwesome: {
  //   marginLeft: 290,
  //   color: "#000",
  // },
  // btnSection: {
  //   width: 80,
  //   //height: 40,
  //   backgroundColor: "#181818",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderRadius: 3,
  //   margin: 5,
  //   padding: 10,
  // },
  // dropdown1BtnStyle: {
  //   width: "100%",
  //   height: 40,
  //   backgroundColor: "#FFF",
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: "#444",
  //   marginTop: 10,
  //   marginBottom: 10,
  // },

  // // dropdown1BtnTxtStyle: { textAlign: "left", color: "black" },
  // // dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  // // dropdown1RowStyle: { backgroundColor: "#FFF", borderBottomColor: "#C5C5C5" },
  // // dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  // dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
  // dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  // dropdown1RowStyle: {
  //   backgroundColor: "#FFF",
  //   borderBottomColor: "#C5C5C5",
  //   height: 30,
  // },
  // dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  // icons: {
  //   marginRight: -20,
  //   fontSize: 30,
  //   flexWrap: "wrap",
  //   flex: 1,
  // },
  // wi50: {
  //   marginTop: -5,
  // },

  // gridView: {
  //   textAlign: "center",
  //   marginBottom: 10,
  // },

  // itemContainer: {
  //   borderRadius: 5,
  //   shadowColor: "black",
  //   shadowOffset: { width: 5, height: 5 },
  //   shadowRadius: 1,
  //   shadowOpacity: 0.1,
  //   elevation: 1,
  //   padding: 10,
  //   display: "flex",
  //   textAlign: "center",
  //   alignItems: "center",
  // },

  // LogoAvatar: {
  //   width: 50,
  //   height: 50,
  //   borderWidth: 0,
  // },
  // pickerStyle: {
  //   backgroundColor: '#fff',
  //   borderColor: '#aaa',
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   height: 50,
  //   marginTop: 10,
  // },
  // dropDownStyle: {
  //   maxHeight: 200,
  //   backgroundColor: '#fff',
  //   borderColor: '#aaa',
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   marginTop: 5,
  //   zIndex: 1000, // 👈 important
  // },
  // textStyle: {
  //   fontSize: 16,
  //   color: '#aaa',
  // },
  // labelStyle: {
  //   color: '#8898AA',
  //   fontWeight: '400',
  // },
  // searchableStyle: {
  //   borderRadius: 6,
  //   borderColor: '#007AFF', // Customize as needed
  //   borderWidth: 1,
  //   padding: 8,
  //   marginBottom: 10,
  // },
  // searchTextStyle: {
  //   color: '#333', // Customize text color here
  //   fontSize: 16,
  // },

  // New Styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding:0

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width:"100%"
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
  refreshButton: {
    padding: 5,
  },
  scrollContent: {
    // paddingBottom: 20,

  },
  contentContainer: {
    paddingHorizontal: 7,
    paddingTop: 5,

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
    paddingBottom:30

  },
 
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15,
    color: '#34495e',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  solutionItem: {
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#3498DB',
    marginRight: 8,
    lineHeight: 20,
  },
  solutionText: {
    fontSize: 14,
    color: '#34495e',
    flex: 1,
    lineHeight: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
    marginTop: 15,
  },
  imageNote: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  gridView: {
    marginTop: 0,
  },
  imageContainer: {
    // width: 100,
    // height: 100,
    width: '100%', 
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
    borderColor:"lightgray",
    borderWidth: 3,
    borderColor: '#ddd',
    borderRadius: 5,
    aspectRatio: 1,  // Ensures square images
    width: '100%', 
    aspectRatio: 1,  // Ensures square items
    position: 'relative',
    // padding:5
  },
  image: {
    padding:5,
    objectFit:"cover",
    width: '100%',
    height: '100%',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 3,
    right: 2,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  imageButtons: {
    marginTop: 15,
  },
  imageButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  saveButtonContainer: {
    padding:5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  ButtonBoxContainer:{
    display:"flex",
    justifyContent:"space-between",
    gap:10,
    flexDirection:"row",
    width:"100%"




  },  
  saveButton: {
    width: '100%',
    borderRadius: 5,
    height: 45,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'left',
  },
  dropdownStyle: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
  },
  dropdownRow: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownRowText: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: '80%',
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

  clearIcon: {
    position: 'absolute',
    top: -5,
    right: -20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },

});



export default JobIssuePageNew;


