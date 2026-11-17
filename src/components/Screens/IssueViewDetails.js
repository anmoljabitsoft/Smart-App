import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Modal,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput
  
} from "react-native";
import { Input, Button } from "galio-framework";
import AntDesign from "react-native-vector-icons/AntDesign";
import ImagePicker from "react-native-image-crop-picker";
import { FlatGrid } from "react-native-super-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text, theme } from "galio-framework";
import RNFS from 'react-native-fs';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { height, width } = Dimensions.get("window");

import {
  URL,
  STORAGE_DRIVERID,
  URLDRIVER,
  STORAGE_VIEW,
  STORAGE_JOBID,
  STORAGE_ISSUEID,
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import SelectSkeleton from "../SelectSkeleton";
import CustomSelect from "./CustomSelect";
import SafeAreaWrapper from "../SafeAreaWrapper";

const IssueViewDetails = ({ navigation, route }) => {
  // State management
  const [showSpinner, setshowSpinner] = useState(false);
  const [issueDetails, setIssueDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [issueTypes, setIssueTypes] = useState([]);
  const [solutionOptions, setSolutionOptions] = useState([]);
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [formData, setFormData] = useState({
    driverNotes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // onst [selectedIssue, setSelectedIssue] = useState(null);
    const [issueDrop, setIssueDrop] = useState([]);
  
    const [selectedIssue, setSelectedIssue] = useState(null);
      const [issueAjax, setIssueAjax] = useState();
    
  
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [solutionsDrop, setSolutionsDrop] = useState([]);
  
    const [loadingIssues, setLoadingIssues] = useState(false);
  const [loadingSolutions, setLoadingSolutions] = useState(false);

  // Fetch issue details
  const fetchIssueDetails = async () => {
    try {
      setshowSpinner(true);
      const driverId = await AsyncStorage.getItem(STORAGE_DRIVERID);
      const issueId = await AsyncStorage.getItem(STORAGE_VIEW);
      
      const response = await axios.post(
        URLDRIVER + "GetIssueDetails", 
        { 
          DriverId: driverId,
          IssueType: JSON.parse(issueId)
        },
        {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        }
      );

      

      if (response && response?.data) {
        console.log("cssssssssssssssssss",data);
        const respData= response?.data
        const data = response.data?.jsonret ? JSON.parse(response?.data?.jsonret) : null;
        if (data) {
          console.log("cssssssssssssssssss",data);
          const responseData={...data,UniqueId:respData?.UniqueId}
          console.log("resssssssssss",responseData);
          setIssueDetails(responseData);
         
          setSolutions(responseData.Solutions || []);
          
          setImages(responseData.Images || []);
          setFormData({ driverNotes: responseData.descc || "" });
        }
      }
    } catch (error) {
      console.error("Error fetching issue details:", error);
      Alert.alert("Error", "Failed to fetch issue details");
    } finally {
      setshowSpinner(false);
    }
  };

  // // Fetch issue types for dropdown
  // const fetchIssueTypes = async () => {
  //   try {
  //     const driverId = await AsyncStorage.getItem(STORAGE_DRIVERID);
  //     const response = await axios.post(
  //       URLDRIVER + "GetIssues", 
  //       { DriverId: driverId },
  //       {
  //         headers: {
  //           Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const formattedData = response.data.map(item => ({
  //       label: item.issue,
  //       value: item.issueId.toString()
  //     }));
  //     setIssueTypes(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching issue types:", error);
  //   }
  // };

  // Fetch solutions for selected issue type
  const fetchSolutions = async (issueId) => {
    try {
      const driverId = await AsyncStorage.getItem(STORAGE_DRIVERID);
      const response = await axios.post(
        URLDRIVER + "GetIssuesSolutions", 
        { 
          DriverId: driverId,
          IssueId: issueId
        },
        {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        }
      );

      const formattedData = response.data.map(item => ({
        label: item.name,
        value: item.id.toString()
      }));
      setSolutionOptions(formattedData);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  const handleIssue = async () => {
    setLoadingIssues(true)
   // setshowSpinner(true)
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
      console.log("dddddsddduuuuuuuuu",json);
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





  // Handle camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    setIsLoadingImages(true);
    const options = {
      mediaType: "photo",
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      saveToPhotos: true,
      includeBase64: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera");
      } else if (response.error) {
        console.log("Camera Error: ", response.error);
        Alert.alert("Error", "Failed to capture image");
      } else if (response.assets) {
        const imageData = response.assets[0];
        const newImage = {
          uri: imageData.uri,
          base64: imageData.base64,
          type: imageData.type,
          name: imageData.fileName || `photo_${Date.now()}.jpg`
        };
        setNewImages(prev => [...prev, newImage]);
      }
      setIsLoadingImages(false);
    });
  };

  // Select images from gallery
  const selectFromGallery = async () => {
    setIsLoadingImages(true);
    try {
      const images = await ImagePicker.openPicker({
        width: 1024,
        height: 1024,
        compressImageQuality: 0.8,
        includeBase64: true,
        multiple: true,
        mediaType: 'photo',
      });

      const formattedImages = images.map(image => ({
        uri: image.path,
        base64: image.data,
        type: image.mime,
        name: image.filename || `image_${Date.now()}.jpg`
      }));

      setNewImages(prev => [...prev, ...formattedImages]);
    } catch (error) {
      console.error("Image Picker Error:", error);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert("Error", "Failed to select images");
      }
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Delete newly added image
  const deleteNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Delete existing image
  const deleteExistingImage = async (sno) => {
    try {
      setshowSpinner(true);
      const jobId = await AsyncStorage.getItem(STORAGE_JOBID);
      const issueType = issueDetails?.issue_id;
        let payload={ 
          JobId: jobId ? JSON.parse(jobId) : "",
          IssueType: issueType,
          sno: sno
        }
        console.log("payyyyyyyyyyyyyyy",payload);
      const response = await axios.post(
        URLDRIVER + "DeleteIssueImages", 
        payload,
        {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        }
      );
      if(response && response.data){
      // Show success message if the request was successful
      Alert.alert("Success", "Image deleted successfully");
      
      // Refresh images after deletion
      fetchIssueDetails();
      }else{
        Alert.alert("Erroe", "Something went wrong!");
      
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete image");
    } finally {
      setshowSpinner(false);
    }
  };

   
  console.log("Img.............",newImages);
  // Save updated issue
  const saveUpdatedIssue = async () => {
    // if (selectedSolutions.length === 0) {
    //   setErrorMessage("Please select at least one solution");
    //   return;
    // }

    try {
      setshowSpinner(true);
      setErrorMessage("");
      const driverId = await AsyncStorage.getItem(STORAGE_DRIVERID);
      const jobId = await AsyncStorage.getItem(STORAGE_JOBID);
      const issueId = await AsyncStorage.getItem(STORAGE_ISSUEID);

      // Payload Of Issue Image 
       // 2. Prepare FormData
       const IssueID= issueId ? JSON.parse(issueId) : ""
        const formData1 = new FormData();
        formData1.append('DriverId', driverId);
        formData1.append('JobId', IssueID);
        formData1.append('UniqueKey',issueDetails?.UniqueId );

       // Issue Payload
       
      let issuePayload={ 
        IssueId: issueDetails?.issue_id,
        DriverId: driverId,
        JobId: issueId ? JSON.parse(issueId) :"",
        IssueType: selectedIssue,
        Solution: selectedSolution || "",
        UniqueKey: issueDetails?.UniqueId,
        Desc: formData?.driverNotes || ""
      };
      
      // First upload new images if any
      if (newImages.length > 0) {
        console.log("ddddddddddddasdwsd",newImages);
          await Promise.all(
          newImages && newImages?.map(async (image, index) => {
            if (!image?.uri) return;
            
            try {
              // Get filename
              const filename = image?.uri.split('/').pop() || `image_${Date.now()}_${index}.jpg`;
  
              // Add to form data
              formData1.append('Images[]', {
                uri: image?.uri,
                type: image.mime || 'image/jpeg',
                name: filename,
              });
            } catch (e) {
              setshowSpinner(false);
              // Fallback to original if compression fails
              console.log("Error:",e);
              Alert.alert("Faild","Upload Image Failed!")
              return;
              formData1.append('Images[]', {
                uri: image.uri,
                type: image.mime || 'image/jpeg',
                name: image.uri.split('/').pop() || `image_${Date.now()}_${index}.jpg`,
              });
            }
          })
        );
        
        const IssueImageURL=`${URLDRIVER}AddIssueImage`
        //. Upload images When Image
      const uploadresponse=  await axios.post(IssueImageURL, formData1, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
          },
        });
  
        console.log("Upload:::::::::::::",uploadresponse);
  

      }
      // Then update issue details
      const response = await axios.post(
        URLDRIVER + "UpdateIssue", 
        issuePayload,
        {
          headers: {
            Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data === "0") {
        setshowSpinner(false);
        Alert.alert("Cannot Update", "This issue has already been approved by admin");
      } else {
        setshowSpinner(false);
        Alert.alert("Success", "Issue updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      setshowSpinner(false);
      console.error("Error updating issue:", error);
      Alert.alert("Error", "Failed to update issue");
    } finally {
      
    }
  };

  // Initialize data
  useEffect(() => {
    handleIssue()
    fetchIssueDetails()
    // fetchIssueTypes();
  }, []);

  // Fetch solutions when issue type changes in edit mode
  // useEffect(() => {
  //   if (editMode && issueDetails && issueDrop) {
  //   //  fetchSolutions(issueDetails.issue_id);
  //   if (issueDetails && issueDetails?.issue_id) {
  //     setIssueAjax(issueDetails?.issue_id);
  //     setLoadingSolutions(true); // Show loader for solutions
  //     const filterIssue=issueDrop && issueDrop.filter(item=>item?.issue==issueDetails?.Issue);
  //     console.log("ddddddddddsqwdqwd",filterIssue);
  //     if(filterIssue && filterIssue.length>0){
  //       setSelectedIssue({label:filterIssue[0]?.issue,value:filterIssue[0]?.issueId})
  //       handleSolutions(filterIssue[0]?.issueId).finally(() => {
  //         setLoadingSolutions(false); // Hide loader when done
  //          //Bind Solution
  //       const filterSolution=solutionsDrop && solutionsDrop?.filter(item=>item?.name==issueDetails?.Solutions[0]?.sols)
  //       if(filterSolution && filterSolution.length>0){
  //         console.log("fffffffffffffffffffffffffffffffffffffff",filterSolution);
  //         setSelectedSolution({label:filterSolution[0]?.name,value:filterSolution[0]?.id} );
  //       }else{
  //         setSelectedSolution(null)
  //       }
  //       })
       
       
  //     }else{
  //       setSelectedIssue(null)
  //     }
  //   } else {
  //     setSolutionsDrop([]);
  //     setSelectedSolution(null);
  //   }
  //   }
  // }, [editMode, issueDetails]);

  useEffect(() => {
    // Reset states when entering edit mode
    if (editMode) {
      setSelectedIssue(null);
      setSelectedSolution(null);
      setLoadingSolutions(true);
    }
  }, [editMode]);
  
  useEffect(() => {
    if (!editMode || !issueDetails || !issueDrop) return;
  
    const matchingIssue = issueDrop.find(item => item.issue === issueDetails.Issue);
    if (!matchingIssue) {
      setSelectedIssue(null);
      setLoadingSolutions(false);
      return;
    }
  
    // Set issue and load solutions
    setSelectedIssue({
      label: matchingIssue.issue,
      value: matchingIssue.issueId
    });
  
    const loadData = async () => {
      await handleSolutions(matchingIssue.issueId);
      setLoadingSolutions(false); // Data is now ready
    };
    loadData();
  }, [editMode, issueDetails, issueDrop]);
  
  // This effect runs ONLY after solutions are loaded
  useEffect(() => {
    if (loadingSolutions || !editMode || !issueDetails) return;
  
    const targetSolutionName = issueDetails.Solutions[0]?.sols;
    if (!targetSolutionName) {
      setSelectedSolution(null);
      return;
    }
  
    const matchingSolution = solutionsDrop.find(item => item.name === targetSolutionName);
    setSelectedSolution(matchingSolution ? {
      label: matchingSolution.name,
      value: matchingSolution.id
    } : null);
  }, [loadingSolutions, solutionsDrop, editMode, issueDetails]);

  

  if (!issueDetails) {
    return (
      <Block flex center style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
      </Block>
    );
  }

  return (
    <SafeAreaWrapper>
    <Block flex style={styles.container}>
      {showSpinner && <OverlaySpinner />}
      
      {/* Header */}
      <Block row style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Issue Details</Text>
        
        <TouchableOpacity 
          onPress={fetchIssueDetails}
          style={styles.refreshButton}
        >
          <FontAwesome name="refresh" size={18} color="#fff" />
        </TouchableOpacity>
      </Block>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Content */}
        <Block style={styles.contentContainer}>
          {/* Job Info Card */}
          <Block style={[styles.card,{padding:15}]}>
            <Block row style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Job ID: {issueDetails.booking_id}</Text>
              
              {!issueDetails.Approved && !editMode && (
                <TouchableOpacity 
                  onPress={() => setEditMode(true)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
              
              {editMode && (
                <TouchableOpacity 
                  onPress={() => {
                    setEditMode(false);
                    setNewImages([]);
                    setErrorMessage("");
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </Block>

            {/* Customer Info */}
            <Block style={styles.infoSection}>
              <Text style={styles.infoLabel}>Customer Name</Text>
              {editMode ? (
                <TextInput
                  editable={false}
                  value={issueDetails.Customername || "N/A"}
                  style={styles.infoInput}
                 
                />
              ) : (
                <Text style={styles.infoText}>{issueDetails.Customername || "N/A"}</Text>
              )}
            </Block>

            <Block style={styles.infoSection}>
              <Text style={styles.infoLabel}>Customer Ref. No.</Text>
              {editMode ? (
                <TextInput
                  editable={false}
                  value={issueDetails.refno || "N/A"}
                  style={styles.infoInput}
                />
              ) : (
                <Text style={styles.infoText}>{issueDetails.refno || "N/A"}</Text>
              )}
            </Block>

            <Block style={styles.infoSection}>
              <Text style={styles.infoLabel}>Date</Text>
              {editMode ? (
                <TextInput
                  editable={false}
                  value={issueDetails.vdate}
                  style={styles.infoInput}
                />
              ) : (
                <Text style={styles.infoText}>{issueDetails.vdate}</Text>
              )}
            </Block>

            <Block style={styles.infoSection}>
              <Text style={styles.infoLabel}>Issue Type</Text>
              {editMode ? (
                
                <>
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
                </>
              ) : (
                <Text style={styles.infoText}>{issueDetails.Issue}</Text>
              )}
            </Block>

            <Block style={styles.infoSection}>
              <Text style={styles.infoLabel}>
                Solutions {errorMessage && <Text style={styles.errorText}> - {errorMessage}</Text>}
              </Text>
              {editMode ? (
                // <SelectDropdown
                //   data={solutionOptions}
                //   defaultValue={selectedSolutions}
                //   onSelect={(selectedItem) => {
                //     setSelectedSolutions(prev => [...prev, selectedItem.value]);
                //   }}
                //   buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                //   rowTextForSelection={(item) => item.label}
                //   buttonStyle={styles.dropdownButton}
                //   buttonTextStyle={styles.dropdownButtonText}
                //   dropdownStyle={styles.dropdownStyle}
                //   rowStyle={styles.dropdownRow}
                //   rowTextStyle={styles.dropdownRowText}
                //   multipleSelect={true}
                // />
                <>
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
                </>
              ) : (
                <Block>
                  {solutions.map((solution, index) => (
                    <Block row key={index} style={styles.solutionItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.solutionText}>{solution.sols}</Text>
                    </Block>
                  ))}
                </Block>
              )}
            </Block>

            <Block style={styles.infoSection}>
              <Text style={styles.infoLabel}>Driver Notes</Text>
              {editMode ? (
                <Input
                  placeholder="Enter your notes"
                  value={formData.driverNotes}
                  onChangeText={(text) => setFormData({...formData, driverNotes: text})}
                  style={styles.notesInput}
                  multiline
                />
              ) : (
                <Text style={styles.infoText}>{issueDetails.descc || "No notes provided"}</Text>
              )}
            </Block>
          </Block>

          {/* Images Section */}
          <Block style={[styles.card,{padding:5}]}>
            <Text style={[styles.sectionTitle,{marginLeft:10}]}>Images</Text>
            
            {editMode && (
              <>
              {images.length>0 && (
                 <Text style={[styles.sectionSubtitle,{marginLeft:10}]}>Old Images</Text>
              )}
              </>
            
            )}

            {/* Existing Images */}
            {images.length > 0 && (
              <FlatGrid
                itemDimension={100}
                data={images}
                style={styles.gridView}
                // spacing={10}
                spacing={5}  // Reduced spacing for better fit
            fixed={true}  // Ensures strict grid layout
            itemsPerRow={3}  // THE KEY PROPERTY FOR 3-COLUMN GRID
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImage(item.path);
                      setModalVisible(true);
                    }}
                   
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.path }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                      {editMode && (
                        <View style={styles.deleteIconContainer}>
                          <TouchableOpacity 
                           onPress={() => {
                            console.log("dddddddddddddlog",issueDetails);
                            if (editMode && !issueDetails.Approved) {
                              console.log("");
                              Alert.alert(
                                "Delete Image",
                                "Are you sure you want to delete this image?",
                                [
                                  { text: "Cancel", style: "cancel" },
                                  { 
                                    text: "Delete", 
                                    style: "destructive",
                                    onPress: (event) => {
                                      if (item?.sno) {
                                        deleteExistingImage(item?.sno);
                                      } else {
                                        console.warn("Cannot delete - missing image ID");
                                      }
                                    }
                                  }
                                ]
                              );
                            }
                          }}
                          >
                             <MaterialIcons name="delete" size={20} color="#fff" />
                          </TouchableOpacity>
                         
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* New Images (in edit mode) */}
            {editMode && (
              <>
                <Text style={[styles.sectionSubtitle,{marginLeft:10}]}>Add New Images</Text>
                
                {isLoadingImages ? (
                  <ActivityIndicator size="large" color="#3498DB" />
                ) : (
                  <>
                    {newImages.length > 0 && (
                      <FlatGrid
                        itemDimension={100}
                        data={newImages}
                        style={styles.gridView}
                        spacing={10}
                        itemsPerRow={3}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedImage(item.uri);
                              setModalVisible(true);
                            }}
                            onLongPress={() => deleteNewImage(index)}
                          >
                            <View style={styles.imageContainer}>
                              <Image
                                source={{ uri: item.uri }}
                                style={styles.image}
                                resizeMode="cover"
                              />
                              <View style={styles.deleteIconContainer}>
                                <MaterialIcons name="delete" size={20} color="#fff" />
                              </View>
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    
                    <Block row space="around" style={styles.imageButtons}>
                      <TouchableOpacity 
                        onPress={takePhoto}
                        style={styles.imageButton}
                      >
                        <FontAwesome name="camera" size={20} color="#fff" />
                        <Text style={styles.imageButtonText}>Camera</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={selectFromGallery}
                        style={styles.imageButton}
                      >
                        <FontAwesome name="image" size={20} color="#fff" />
                        <Text style={styles.imageButtonText}>Gallery</Text>
                      </TouchableOpacity>
                    </Block>
                  </>
                )}
              </>
            )}
          </Block>
        </Block>
      </ScrollView>

      {/* Save Button in Edit Mode */}
      {editMode && !issueDetails.Approved && (
        <Block style={styles.saveButtonContainer}>
          <Button 
            onPress={saveUpdatedIssue}
            color="#3498DB"
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Button>
        </Block>
      )}

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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
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
    paddingBottom:50
  },
  // cardImg: {
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   padding: 6,
  //   marginBottom: 15,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  //   paddingBottom:50
  // },
 
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
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
});

export default IssueViewDetails;