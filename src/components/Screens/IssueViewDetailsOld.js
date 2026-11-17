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
  
} from "react-native";
import { Input,Button } from "galio-framework";
import AntDesign from "react-native-vector-icons/AntDesign";
import ImagePicker from "react-native-image-crop-picker";

import { FlatGrid } from "react-native-super-grid";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Block, Text, theme } from "galio-framework";

import {
  URL,
  STORAGE_DRIVERID,
  URLDRIVER,
  STORAGE_VIEW,
  STORAGE_JOBID,
  STORAGE_ISSUEID,
} from "../../utils/factory";

import { OverlaySpinner } from "../../utils/Spinner";

// import SelectDropdown from "react-native-select-dropdown";

// import Select2 from "react-native-select-two";

import RNFS from 'react-native-fs';

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const { height, width } = Dimensions.get("window");

const IssueViewDetails = ({ navigation, route, style }) => {
  const [joblist, setjoblist] = useState([]);
  const [updateState, setUpdateState] = useState([]);
  const [allPickupAddresses, setAllPickupAddresses] = useState([]);
  const [showSpinner, setshowSpinner] = useState(false);
  const [issueLists, setIssueLists] = useState("");
  const [editIssueLists, setEditIssueLists] = useState([]);
  const [solutions, setSolutions] = useState();
  const [editSolutions, setEditSolutions] = useState([]);
  const [images, setImages] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modelImage, setModelImage] = useState("");
  const [issueAjax, setIssueAjax] = useState();
  const [solutionsDrop, setSolutionsDrop] = useState([]);
  const [issueDrop, setIssueDrop] = useState([]);
  const [updateOption, setUpdateOption] = useState(false);
  const [selectItem, setSelectItem] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [quote, setQuote] = React.useState({
    amountFirst: "",
    amountSecond: "",
    amountThird: "",
    amountFour: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [editApprovedOrNot, setEditApprovedOrNot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAmountForm = (e, type) => {
    const value = e.nativeEvent.text;
    const data = {
      amountFirst: quote.amountFirst.toString(),
      amountSecond: quote.amountSecond.toString(),
      amountThird: quote.amountThird.toString(),
      amountFour: quote.amountFour.toString(),
    };
    if (type == "amountFirst") {
      data.amountFirst = value;
    }
    if (type == "amountSecond") {
      data.amountSecond = value;
    }
    if (type == "amountThird") {
      data.amountThird = value;
    }
    if (type == "amountFour") {
      data.amountFour = value;
    }

    setQuote(data);
  };

  const readData = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
    };
    const map = [];

    try {
      setshowSpinner(true);
      axios
        .post(
          URL + "GetAllJobs",
          { DriverId: driverid },
          {
            headers: {
              Authorization:
                "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const allData = JSON.stringify(response.data);
          const newdata = JSON.parse(allData);
          for (var i = 0; i < newdata.length; i++) {
            const allpickup = newdata[i].pickupAddresses;

            if (allpickup) {
              allpickup.forEach((item) => {
                map.push({ pickupAddress: item.pickupAddress });
              });
              setAllPickupAddresses(map);
            }
          }
          // console.log("JOB LIST DATA FROM BACK END <>_<>", newdata[0].pickupAddresses);
          if (response.status === 200) {
            setjoblist(response.data);
          } else {
            //            setNotFound(true);
          }
          setshowSpinner(false);
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(false);
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      console.log(error);
    }
  };

  const issueView = async () => {
    setshowSpinner(true)
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const driverIds = await AsyncStorage.getItem(STORAGE_VIEW);
    const json = {
      DriverId: driverid,
      IssueType: JSON.parse(driverIds),
    };

    let map = [];
    let maps = [];
    // console.log("ISUEEEEEEEEEE",URLDRIVER + "GetIssueDetails");
    // console.log("PAYYYYYYYYYYYYYYY",json);
    try {
      axios
        .post(URLDRIVER + "GetIssueDetails", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("resppppppppppppppppppppppp",response.data);
          if(response && response.data?.length>0){
          const responseList =response.data[0]?.jsonret ? JSON.parse(response.data[0]?.jsonret):"";
          setIssueLists(responseList);
          const solutions = responseList.Solutions;
          const images = responseList.Images;
          if (solutions) {
            solutions.forEach((item) => {
              console.log(
                "*************************************************",
                item
              );
              map.push({ sols: item.sols });
            });
            setSolutions(map);
          }
          if (images) {
            images.forEach((item) => {
              maps.push({ path: item.path });
            });

            setImages(maps);
          }
          setshowSpinner(false)
        }
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(false)
        })
        .finally(function () {
          console.log("Finally Call");
        });
    } catch (error) {
      setshowSpinner(false)
      console.log("Api Error", error);

    }
  };

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
            map.push({ issue: "please select", issueId: 0 });
            responseData.forEach((item) => {
              map.push({ issue: item.issue, issueId: item.issueId });
            });
            setIssueDrop(map);
            // if (editIssueLists) handleSolutions();
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

  const handleSolutions = async (id, itemList) => {
    console.log();
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
      IssueId: id,
    };

    let map = [];
    try {
      axios
        .post(URLDRIVER + "GetIssuesSolutions", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response.data;
          // map.push({ id: 0, name: "please select" });
          responseData.forEach((item) => {
            if (itemList && updateOption) {
              itemList.map((i) => {
                if (i.sols == item.id) {
                  map.push({ id: item.id, name: item.name, checked: true });
                }
              });
            }
            map.push({ id: item.id, name: item.name });
          });
          setSolutionsDrop(map);
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          // always executedr
        });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleImagesFromGallery = () => {
  //   let map = [];
  //   let options = {
  //     selectionLimit: 0,
  //     title: "Select Image",
  //     customButtons: [
  //       { name: "customOptionKey", title: "Choose Photo from Custom Option" },
  //     ],
  //     storageOptions: {
  //       skipBackup: true,
  //       path: "images",
  //     },
  //   };
  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log("User cancelled image picker");
  //     } else if (response.error) {
  //       console.log("ImagePicker Error: ", response.error);
  //     } else if (response.customButton) {
  //       // console.log("User tapped custom button: ", response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       setSelectedImage(response.assets[0].uri);
  //       const responseData = response.assets;
  //       responseData.forEach((item) => {
  //         RNFS.readFile(item.uri, "base64").then((data) => {
  //           map.push({ data });
  //           setUpdateState([...map]);
  //         });
  //       });
  //     }
  //   });
  // };

  //capture image
  const handleOpenCamera = () => {
    setIsLoading(true);

    requestCameraPermission();
    const options = {
      mediaType: "photo",
      quality: 0.5,
      maxWidth: 800,
      maxHeight: 800,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        alert(response.customButton);
      } else {
        if (response.assets) {
          const responseData = response.assets;

          // Get the URI of the captured image
          const imageUri = responseData[0].uri;
          setSelectedImage(imageUri);

          // Read file and convert to base64
          RNFS.readFile(imageUri, "base64")
            .then((data) => {
              // Store the base64 data in state
              setUpdateState((prev) => [...prev, { data: `${data}` }]);
            })
            .catch((error) => {
              console.log("Error reading file: ", error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    });
  };

  const handleImageLibery = () => {
    setIsLoading(true);
    ImagePicker.openPicker({
      width: 800,
      height: 800,
      compressImageQuality: 0.5,
      includeBase64: true,
      multiple: true,
    })
      .then((images) => {
        const newImages = images.map((image) => ({
          uri: `data:image/jpeg;base64,${image.data}`,
        }));

        const newImages1 = images.map((image) => ({ data: image.data }));

        // select issue image
        setUpdateState((prev) => [...prev, ...newImages1]);
      })
      .catch((error) => {
        console.error("Image Picker Error: ", error);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };


  const handleStartFinishJob = async () => {
    navigation.navigate("IssueListPage", { screen: "IssueListPage" });
  };

  const handleImagePopUp = (path) => {
    setModelImage(path);
    setModalVisible(true);
  };

  const handleEditJobDetails = async (id) => {
    setEditApprovedOrNot("");
    handleIssue();
    if (id == 1) setUpdateOption(true);
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const driverIds = await AsyncStorage.getItem(STORAGE_VIEW);

    const json = {
      DriverId: driverid,
      IssueType: JSON.parse(driverIds),
    };

    let map = [];
    let maps = [];

    try {
      axios
        .post(URLDRIVER + "EditIssueDetails", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then(async (response) => {
          const responseList = await JSON.parse(response.data);
          if (responseList && responseList) {
            console.log(
              "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
              responseList
            );
            setEditIssueLists(responseList && responseList);
            setEditApprovedOrNot(responseList.Approved);
            if (responseList.Approved == true) {
              alert(
                "This issue has already been approved by admin, you cannot edit it"
              );
            }
            const solutions = await responseList.Solutions;
            const images = await responseList.Images;
            if (solutions) {
              solutions.forEach((item) => {
                map.push({ sols: item.sol_id });
              });
              setEditSolutions(map);
              handleSolutions(responseList.Issue, map);
            }
            if (images) {
              images.forEach((item) => {
                maps.push({ path: item.path, sno: item.sno });
              });
              setEditImages(maps);
            }
          }
        })
        .catch((error) => {
          console.log("API error", error);
        })
        .finally(function () {
          console.log("Finally Call");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCencle = async (id) => {
    if (id == 1) {
      setUpdateOption(false);
      setEditIssueLists([]);
      setErrorMessage("");
      setSelectItem("");
      setEditSolutions();
      setEditImages();
      issueView();
    }
  };

  const handleEditImage = async (item) => {
    const driverid = await AsyncStorage.getItem(STORAGE_JOBID);
    const json = {
      JobId: JSON.parse(driverid),
      IssueType: editIssueLists.issue_id,
      sno: item,
    };

    // console.log("json inside handle edit images", json);

    let map = [];

    axios
      .post(URLDRIVER + "DeleteIssueImages", json, {
        headers: {
          Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const responseList = JSON.parse(response.data);
        // console.log("4444444444444444444", responseList);

        const images = responseList;
        if (images) {
          // console.log("55555555555555555", images);
          setEditImages([]);
          images.forEach((item) => {
            // console.log("6666666666666666", item);

            map.push({ path: item.path });
          });
          setEditImages(map);
        }
        readData();
        issueView();
        readData();
        handleEditJobDetails();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const saveImage = async () => {
    handleUpdateIssueList();
  };

  const handleUpdateIssueList = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    const issueId = await AsyncStorage.getItem(STORAGE_ISSUEID);
    const solutionIds = JSON.stringify(selectItem);

    const json = {
      DriverId: driverid,
      JobId: JSON.parse(`"${issueId}"`),
      Image: updateState && updateState ? updateState : "",
      UniqueKey: editIssueLists.UniqueId,
    };

    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", json);

    const json1 = {
      IssueId: editIssueLists.issue_id,
      DriverId: driverid,
      JobId: JSON.parse(`"${issueId}"`),
      IssueType: issueAjax ? issueAjax : editIssueLists.Issue,
      Solution: JSON.stringify(selectItem),
      UniqueKey: editIssueLists.UniqueId,
      Desc: quote.amountThird,
    };

    try {
      if (selectItem.length == "") {
        setErrorMessage("Please select solution");
      } else {
        setshowSpinner(true);

        axios
          .post(URLDRIVER + "AddIssueImage", json, {
            headers: {
              Authorization:
                "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            try {
              axios
                .post(URLDRIVER + "UpdateIssue", json1, {
                  headers: {
                    Authorization:
                      "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
                    "Content-Type": "application/json",
                  },
                })
                .then((response) => {
                  setshowSpinner(false);

                  if (response.data == "0") {
                    alert(
                      "This issue has already been approved by admin, you cannot edit it"
                    );
                  } else {
                    alert("Issue updated successfully");
                    setErrorMessage("");
                    navigation.navigate("IssueListPage");
                  }
                })
                .catch((error) => {
                  setshowSpinner(false);

                  console.log("API error", error);
                })
                .finally(function () {
                  // always executedr
                  setshowSpinner(false);
                });
            } catch (error) {
              console.log(error);
              setshowSpinner(false);
            }
          })
          .catch((error) => {
            console.log("API error", error);
            setshowSpinner(false);
          })
          .finally(function () {
            // always executedr
            setshowSpinner(false);
          });
      }
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
    }
  };

  useEffect(() => {
    const data = async () => {
      await issueView();
    };

    data();
  }, []);

  return (
    <Block flex>
      {showSpinner && <OverlaySpinner />}
      <Block row style={styles.Headers}>
        <Block flex row>
        <Text
                    style={styles.BackText}
                    color={theme.COLORS.SECONDARY}
                    onPress={() => {
                      navigation.navigate("IssueListPage");
                    }}
                    
                  >
                    <AntDesign name="arrowleft" style={styles.BackIcon} />
                  </Text>
          <Text style={styles.Joblisttitle} 
          // color={theme.COLORS.SECONDARY}
          >
            Job Issues Details
          </Text>
        </Block>
        <Block left>
          {updateOption == true ? (
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 12 }}
              center
              color="info"
              style={styles.log}
              onPress={() => handleEditJobDetails(1)}
            >
              <Text style={styles.refreshBtn}>
                Refresh{" "}
                <FontAwesome
                  style={styles.refreshIcon}
                  name="retweet"
                  color={"#fff"}
                  size={16}
                  onPress={() => handleEditJobDetails(1)}
                />
              </Text>
            </Button>
          ) : (
            <Button
              // textStyle={{ fontFamily: "montserrat-regular", fontSize: 12 }}
              center
              color="info"
              style={styles.log}
              onPress={issueView}
            >
              <Text style={styles.refreshBtn}>
                Refresh{" "}
                <FontAwesome
                  style={styles.refreshIcon}
                  name="retweet"
                  color={"#fff"}
                  size={16}
                  onPress={issueView}
                />
              </Text>
            </Button>
          )}
        </Block>
      </Block>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block style={styles.container}>
          <Block style={styles.cardContainerOne}>
            <Block flex style={styles.CustomerdetailsOne}>
              <Block row>
                <Block flex>
                  <Text
                    size={14}
                    style={styles.cardTitle}
                    // color={theme.COLORS.SECONDARY}
                  >
                    Job ID : {issueLists.booking_id}
                  </Text>
                </Block>

                {issueLists.Approved == false && (
                  <Block flex style={styles.cardTitle1}>
                    <Block row>
                      {updateOption == false ? (
                        <Text
                          size={14}
                          style={styles.updateButton}
                          onPress={() => handleEditJobDetails(1)}
                        >
                          Edit
                        </Text>
                      ) : null}

                      {updateOption == true ? (
                        <Text
                          size={14}
                          style={styles.cancelButton}
                          onPress={() => handleCencle(1)}
                        >
                          Cancel
                        </Text>
                      ) : null}
                    </Block>
                  </Block>
                )}
              </Block>

              <Block style={styles.subDiv}>
                <Block>
                  <Block>
                    <Text
                      // eslint-disable-next-line react-native/no-inline-styles
                      // style={{fontFamily: 'montserrat-regular'}}
                      size={14}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Customer Name
                    </Text>
                  </Block>

                  <Block flex>
                    {updateOption == false ? (
                      <Text
                        size={14}
                        style={styles.notes}
                        // color={theme.COLORS.SECONDARY}
                      >
                        {issueLists && issueLists.refno
                          ? issueLists.Customername
                          : "N/A"}
                      </Text>
                    ) : (
                      <Input
                        editable={false}
                        placeholder="Customer Name"
                        placeholderTextColor={"#8898AA"}
                        name="amountFirst"
                        onChange={(e) => handleAmountForm(e, "amountFirst")}
                        shadowless
                      >
                        {issueLists ? issueLists.Customername : "N/A"}
                      </Input>
                    )}
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      // eslint-disable-next-line react-native/no-inline-styles
                      // style={{fontFamily: 'montserrat-regular'}}
                      size={14}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Customer Ref. No.
                    </Text>
                  </Block>

                  <Block flex>
                    {updateOption == false ? (
                      <Text
                        size={14}
                        style={styles.notes}
                        // color={theme.COLORS.SECONDARY}
                      >
                        {issueLists && issueLists.refno
                          ? issueLists.refno
                          : "N/A"}
                      </Text>
                    ) : (
                      <Input
                        editable={false}
                        placeholder="Customer Ref No."
                        placeholderTextColor={"#8898AA"}
                        name="amountFirst"
                        onChange={(e) => handleAmountForm(e, "amountFirst")}
                        shadowless
                      >
                        {editIssueLists && editIssueLists.refno
                          ? editIssueLists.refno
                          : "N/A"}
                      </Input>
                    )}
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Date
                    </Text>
                  </Block>

                  <Block flex>
                    {updateOption == false ? (
                      <Text
                        size={14}
                        style={styles.notes}
                        // color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.vdate}
                      </Text>
                    ) : (
                      <Input
                        editable={false}
                        placeholder="Amount"
                        placeholderTextColor={"#8898AA"}
                        name="amountFirst"
                        onChange={(e) => handleAmountForm(e, "amountSecond")}
                        shadowless
                      >
                        {editIssueLists.vdate}
                      </Input>
                    )}
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Issues Type
                    </Text>
                  </Block>

                  <Block flex>
                    {updateOption == false ? (
                      <Text
                        size={14}
                        style={styles.notes}
                        // color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.Issue}
                      </Text>
                    ) : (
                      // <SelectDropdown
                      //   defaultValueByIndex={issueLists.Issue}
                      //   data={issueDrop}
                      //   onSelect={(selectedItem, index) => {
                      //     setIssueAjax(selectedItem.issueId);
                      //     if (updateOption) {
                      //       handleSolutions(editIssueLists.Issue);
                      //     }
                      //     handleSolutions(selectedItem.issueId);
                      //   }}
                      //   defaultButtonText={issueLists.Issue}
                      //   buttonTextAfterSelection={(selectedItem, index) => {
                      //     return selectedItem.issue;
                      //   }}
                      //   rowTextForSelection={(item, index) => {
                      //     return item.issue;
                      //   }}
                      //   buttonStyle={styles.dropdown1BtnStyle}
                      //   buttonTextStyle={styles.dropdown1BtnTxtStyle}
                      //   renderDropdownIcon={(isOpened) => {
                      //     return (
                      //       <FontAwesome
                      //         name={isOpened ? "chevron-up" : "chevron-down"}
                      //         color={"#444"}
                      //         size={14}
                      //       />
                      //     );
                      //   }}
                      //   dropdownIconPosition={"right"}
                      //   dropdownStyle={styles.dropdown1DropdownStyle}
                      //   rowStyle={styles.dropdown1RowStyle}
                      //   rowTextStyle={styles.dropdown1RowTxtStyle}
                      // />
                      <>dddddd</>
                    )}
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Solutions{" "}
                      <Text style={{ color: "red" }}> {errorMessage} </Text>
                    </Text>
                  </Block>

                  <Block flex>
                    {updateOption == false &&
                      solutions &&
                      solutions.length > 0 &&
                      solutions.map((item) => (
                        <Text
                          size={14}
                          style={styles.notesSolutions}
                          // color={theme.COLORS.SECONDARY}
                        >
                          <Text style={styles.Bullets}>{"\u2B24"}</Text>{" "}
                          <Text style={styles.Sols}>{item.sols}</Text>
                        </Text>
                      ))}

                    {updateOption == true ? (
                      <Block flex>
                        <View>
                          {/* <Select2
                            defaultValueByIndex={2}
                            isSelectSingle={true}
                            style={{ borderRadius: 5, backgroundColor: "#fff" }}
                            colorTheme="#000000"
                            popupTitle="Select Solution"
                            title={solutions[0].sols}
                            data={solutionsDrop}
                            onSelect={(data) => {
                              setSelectItem(data);
                            }}
                            onRemoveItem={(data) => {
                              setSelectItem(data);
                            }}
                          /> */}
                        </View>
                      </Block>
                    ) : null}
                  </Block>
                </Block>

                <Block>
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Driver Notes
                    </Text>
                  </Block>

                  <Block flex>
                    {updateOption == false ? (
                      <Text
                        size={14}
                        style={styles.notesMain}
                        // color={theme.COLORS.SECONDARY}
                      >
                        {issueLists.descc}
                      </Text>
                    ) : (
                      <Input
                        placeholder="Driver Notes"
                        placeholderTextColor={"#8898AA"}
                        name="amountFirst"
                        onChange={(e) => handleAmountForm(e, "amountThird")}
                        shadowless
                      >
                        {editIssueLists.descc}
                      </Input>
                    )}
                  </Block>
                </Block>
              </Block>
              <Block style={styles.ImageBlock}>
                {updateOption == false && (
                  <Block>
                    <Text
                      size={14}
                      style={styles.ListTitleLeft}
                      // color={theme.COLORS.SECONDARY}
                    >
                      Images
                    </Text>
                  </Block>
                )}
                {updateOption == true && (
                  <Block>
                    <Block row>
                      <Text
                        size={10}
                        style={styles.ListTitleLeft}
                        // color={theme.COLORS.SECONDARY}
                      >
                        Images
                      </Text>
                      <Text
                        size={10}
                        style={styles.ListTitleLeft12}
                        // color={theme.COLORS.SECONDARY}
                      >
                        {` (long press to delete image)`}
                      </Text>
                    </Block>
                  </Block>
                )}

                <Block>
                  <Block style={{ flexDirection: "row" }}>
                    {updateOption == false && (
                      <FlatGrid
                        itemDimension={80}
                        data={images}
                        style={styles.gridView}
                        spacing={10}
                        renderItem={({ item }) => (
                          <View style={[styles.itemContainer]}>
                            <Image
                              source={{
                                uri: item.path,
                              }}
                              style={styles.LogoAvatar}
                              resizeMode="contain"
                            />
                          </View>
                        )}
                      />
                    )}
                  </Block>
                  <Block style={{ flexDirection: "row" }}>
                    {updateOption == true && (
                      <FlatGrid
                        itemDimension={80}
                        data={editImages}
                        style={styles.gridView}
                        spacing={10}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            activeOpacity={0.4}
                            onLongPress={() => handleEditImage(item.sno)}
                            onPress={() => handleImagePopUp(item.path)}
                          >
                            <View style={[styles.itemContainer]}>
                              <Image
                                source={{
                                  uri: item.path,
                                }}
                                style={styles.LogoAvatar}
                                resizeMode="contain"
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                  </Block>
                </Block>

                <Block style={{ marginTop: 15 }}>
                  {updateOption == true ? (
                    <Block>
                      <Text
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{ fontFamily: "montserrat-regular" }}
                        size={14}
                        // eslint-disable-next-line react/jsx-no-duplicate-props
                        // style={styles.Text}
                        // color={theme.COLORS.SECONDARY}
                      >
                        Select Issue Image
                      </Text>
                    </Block>
                  ) : null}

                  <Block>
                    <View style={{ flex: 1 }}>
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
                    </View>
                  </Block>
                </Block>

                <Block>
                  <Block row space="around">
                    {updateOption == true ? (
                      <Block middle style={styles.btnSection}>
                        <TouchableOpacity
                        //  onPress={handleOpenCamera}
                         >
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
                    ) : null}

                    {updateOption == true ? (
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
                    ) : null}
                  </Block>
                </Block>
              </Block>

              {updateOption == false && (
                <Block center>
                  {/* <Button
                    style={styles.createButton}
                    onPress={() => handleStartFinishJob()}
                    //color="primary"
                    round
                  >
                    <Text
                      // style={{ fontFamily: "montserrat-bold" }}
                      size={14}
                      color="#fff"
                    >
                      Back
                    </Text>
                  </Button> */}
                  button
                </Block>
              )}

              {updateOption == true && editApprovedOrNot == false && (
                <Block center>
                  <Button
                    style={styles.createButton}
                    onPress={() => saveImage()}
                    round
                  >
                    <Text size={14} color="#fff">
                      Update
                    </Text>
                  </Button>
                </Block>
              )}

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
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 10,
  },

  image: {
    width: 90,
    height: 90,
  },
  delButton: {
    color: "#fff",
    backgroundColor: "#000",
    height: 22,
    width: 22,
    borderRadius: 50,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: -10,
    position: "relative",
    zIndex: 999,
    marginLeft: 78,
    borderColor: "#fff",
    borderWidth: 1.5,
    paddingTop: 1.5,
  },
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
  Headers: {
    backgroundColor: "#3498DB",
    padding: 15,
    color:'#fff'
  },
  BackText: {
    // color: theme.COLORS.BLACK,
     color:'#fff',
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
 
  Joblisttitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },
  avatar: {
    height: 90,
    width: 90,
    margin: 5,
    display: "flex",
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
  // Joblisttitle: {
  //   color: theme.COLORS.BLACK,
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginTop: 3,
  // },
  CustomerdetailsOne: {
    padding: 7,
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
    paddingLeft: 7,
    paddingBottom: 10,
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  cardTitle1: {
    color: "#000",
    fontSize: 18,
    paddingLeft: 7,
    paddingBottom: 0,
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 1,
    marginBottom: 10,
    textAlign: "right",
  },
  cardSubTitle: {
    color: "#A0A0A0",
    fontSize: 13,
    paddingLeft: 7,
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
    width: 50,
    height: 25,
  },
  notes: {
    color: "gray",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  notesSolutions: {
    color: "gray",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    textAlign: "justify",
  },
  notesMain: {
    color: "gray",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    textAlign: "justify",
  },
  ListTitleLeft: {
    color: "#5C5C5C",
    fontWeight: "bold",
    fontSize: 13,
  },

  ListTitleLeft12: {
    color: "#5C5C5C",
    marginTop: 3,
    fontSize: 11,
  },

  subDiv: {
    paddingLeft: 7,
  },
  ImgView: {
    display: "flex",
  },
  ImageBlock: {
    paddingLeft: 10,
  },
  Bullets: {
    color: "#000",
    fontSize: 8,
  },
  Sols: {
    paddingLeft: 50,
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

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalClose: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalImage: {
    height: height - 80,
    width: width - 25,
    borderRadius: 15,
  },
  createButton: {
    width: width * 0.5,
    backgroundColor: "#3498DB",
  },
  refresshButton: {
    marginTop: 10,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#3498DB",
    marginLeft: 110,
    borderRadius: 10,
    paddingTop: 5,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  updateButton: {
    marginTop: 0,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#3498DB",
    borderRadius: 10,
    height: 25,
    padding: 4,
    marginLeft: 100,
    marginRight: 10,
    width: 55,
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 0,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#3498DB",
    borderRadius: 10,
    height: 25,
    padding: 4,
    width: 55,
    textAlign: "center",
    marginLeft: 100,
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

  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#FFF",
    borderBottomColor: "#C5C5C5",
    height: 30,
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
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

  gridView: {
    textAlign: "center",
    marginBottom: 5,
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
});

export default IssueViewDetails;
