import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text } from "galio-framework";
import {
  URL,
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URLDRIVER,
  STORAGE_SIGNATURE,
  STORAGE_SIGN,
} from "../../utils/factory";
import Customerdetail from "../Jobdetail/Customerdetail";
import Jobdetail from "../Jobdetail/Jobdetail";
import JobOtherDetail from "../Jobdetail/JobOtherDetail";
// import { OverlaySpinner } from "../../utils/Spinner";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { Stopwatch, Timer } from "react-native-stopwatch-timer"; // not working because depreciated
import uuid from "react-native-uuid";
import OverlaySpinner from "../../utils/Spinner";
import Stopwatch from "./Stopwatch";
import SafeAreaWrapper from "../SafeAreaWrapper";
const { height, width } = Dimensions.get("window");
import { SafeAreaView } from 'react-native-safe-area-context';

const Jobdetailpage = ({ navigation, route, props }) => {
  const [jobDetail, setJobDetail] = useState([]);
  const [jobflag, setJobFlag] = useState(0);
  const [showSpinner, setshowSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [timerDuration, setTimerDuration] = useState(route?.params?.paramKey);
  // const [timerDuration, setTimerDuration] = useState(0);

  const [customerImage, setCustomerImage] = useState(null);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [liveTracking, setLiveTracking] = useState(false);
  const [liveTrackingMessage, setLiveTrackingMessage] = useState("");
  const [alertFlag, setAlertFlag] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
      const [refreshing, setRefreshing] = React.useState(false);
  

  const handleOpenPopUp = (id) => {
    if (id == 1) {
      setIsStopwatchStart(false);
      setModalVisible(true);
    }
  };

  const readData = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    console.log("details>>>>>>>>>>>>>>>>>>>>>>>>>>>",{driverid,jobid});
    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
    };
    try {
      setshowSpinner(true);
      axios
        .post(URL + "GetJobDetails", json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then(async (response) => {
          if (response.status == 200) {
            console.log("dddddddddddwedwedwededwed",response.data);

            setJobDetail(response.data);
            setCustomerImage(response.data.isCustomerImages);
            setLiveTrackingMessage(
              response?.data?.isLivetracking== 0 ? "1" : "2"
              
            );
           
          } 
          console.log("dsddddddddddddd1111111111");
          setIsStopwatchStart(false)
          setshowSpinner(false);
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(true);
          readData(); //comment
        })
        .finally(function () {
          setshowSpinner(false);
        });
    } catch (error) {
      console.log(error);
      setshowSpinner(true);
      readData(); // comment 
    } 
  };

  const handleStartStopJob = (data) => {
    if (data == "ST") {
      setIsStopwatchStart(!isStopwatchStart);
      setResetStopwatch(false);
    } else if (data == "PS") {
      setIsStopwatchStart(false);
    } else if (data == "RS") {
      setIsStopwatchStart(true);
    } else if (data == "FN") {
      setIsStopwatchStart(false);
    }
  };

  // JOB Button Actions =>
  const handleStartFinishJob = async (type) => {
    setshowSpinner(true);
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    console.log("sdwedwefwefewefsttttttttttt",{driverid,jobid});
    const json = {
      DriverId: driverid,
      JobId: JSON.parse(jobid),
      Button: type,
    };

    handleStartStopJob(type);

    try {
      axios
        .post(URLDRIVER + "StartPauseJob", json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status == 200) {
            readData();
          } else {
            // setNotFound(true);
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
    }
  };

  
  useEffect(() => {
    setRefreshing(true)
    setIsStopwatchStart(false);
    readData();
    setRefreshing(false)

  }, [route]);

  useEffect(() => {
    setIsStopwatchStart(false);
  }, [navigation]);

  const handleRedirect = () => {
    setIsStopwatchStart(false);
    AsyncStorage.removeItem(STORAGE_SIGNATURE);
    AsyncStorage.removeItem(STORAGE_SIGN);
    navigation.navigate("Paymentpage");
  };

  const handleJobissuePage = (id) => {
    const customerRefNumber = jobDetail.refNo;
    if (id == 1) {
      navigation.navigate("JobsIssuePage", {
        paramKey: customerRefNumber && customerRefNumber,
      });
    }
  };

  const handleStartTracking = async (type) => {
    setIsLoading(true);

    let unique_id = uuid.v4();
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    console.log("startedTracking>>>>>>>>>>>",{driverid,jobid,type,jobDetail});
    const json = {
      Driverid: driverid,
      jobId:jobid? JSON.parse(jobid) :"",
      UniqueId: unique_id,
      isActive: 1,
      qtype: type,
      DropAddress: jobDetail?.dropAddresses[0].address,
      customerName: jobDetail?.customerName, //"Live Tracking - Manish", 
      customerMobile:jobDetail?.customerMobile, //"+61 430 918 798", 
    };
console.log("ttttttttttttttttttttt",json);
    try {
      axios
        .post(URLDRIVER + "UpdateLiveTracking", json, {
          headers: {
            Authorization:
              "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setIsLoading(false);
          console.log("resssssssssss",response);
          if (response?.data?.ret > 1) {
            //tracking is started
            setAlertFlag(true);
            setAlertMessage(response?.data?.retMsg);
          }

          if (response?.data?.ret == "1") {
            setLiveTrackingMessage("2");
          } else if (response?.data?.ret == "2") {
            setLiveTrackingMessage("2");
          } else if (response?.data?.ret == 11) {
            setLiveTrackingMessage("1");
          }
        })
        .catch((error) => {
          console.log("API error", error);
          setIsLoading(false);
        })
        .finally(function () {
          setIsLoading(false);

          // always executedr
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleCutomerImgPage = (id) => {
    const customerRefNumber = jobDetail?.refNo;
    if (id == 1) {
      navigation.navigate("CustomerImage", {
        paramKey: customerRefNumber && customerRefNumber,
      });
    }
  };

  const handleWAiverFromPage = (id) => {
    const customerRefNumber = jobDetail.jobId;
    if (id == 1) {
      navigation.navigate("WaiverFrom", {
        paramKey: customerRefNumber && customerRefNumber,
      });
    }
  };

  const handleProceedButton = (id) => {
    if (id == 1) {
      setModalVisible(false);
      setIsStopwatchStart(false);
      handleStartFinishJob("FN");
    }
  };

  
  useEffect(() => {
    const handleStartPushButton = async () => {
      if (jobDetail.isfinish == 1) {
        setIsStopwatchStart(false);
      } else {
        if (
          jobDetail &&
          jobDetail.isstarted > 0 &&
          jobDetail.start_Stop_Flag == 1
        ) {
           setIsStopwatchStart(true);
        } else if (
          jobDetail &&
          jobDetail.isstarted > 0 &&
          jobDetail.start_Stop_Flag == 0
        ) {
           setIsStopwatchStart(false);
        }
      }
    };

    handleStartPushButton();
  }, [jobDetail && jobDetail]);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('MyJobs');
        return true; // Prevent default back behavior
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    // <SafeAreaWrapper>
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
    <Block flex>
      {showSpinner && <OverlaySpinner />}
      <Block row style={styles.Headers}>
        <Block flex row>
          <TouchableOpacity onPress={() => navigation.navigate("MyJobs")}>
          <Text
            style={styles.BackText}
          >
            <AntDesign name="arrowleft" style={styles.BackIcon} />
          </Text>
          </TouchableOpacity>
          
          <Text
           
            style={styles.Joblisttitle}
          >
            Business Job - {jobDetail.jobId || "******"}
          </Text>

          {isStopwatchStart == true ? (
            <Text style={styles.dottGreen} />
          ) : (
            <Text style={styles.dottRed} />
          )}
          <Text style={styles.Timer}>
        <Stopwatch
        start={isStopwatchStart}
        reset={resetStopwatch}
        options={stopwatchOptions}
        startTime={timerDuration}
      />
          </Text>
        </Block>
      </Block>
      <Block style={styles.container}>
        <Block row style={styles.topButton}>
          <Block flex left>
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
              center
              color="info"
              style={styles.log}
              onPress={() => {
                handleWAiverFromPage("1");
              }}
            >
              Waiver Form
            </Button>
          </Block>

          {customerImage != 0 ? (
            <Block flex right>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
                center
                color="info"
                style={styles.log2}
                onPress={() => {
                  handleCutomerImgPage("1");
                }}
              >
                <Text style={{ fontSize: 11, color: "#fff" }}>
                  Customer Images ({customerImage})
                </Text>
              </Button>
            </Block>
          ) : (
            <Block flex right>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
                center
                color="info"
                style={styles.CustomerImages}
                disabled
              >
                Customer Images
              </Button>
            </Block>
          )}

          <Block right>
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
              center
              color="info"
              style={styles.log1}
              onPress={readData}
            >
              <Text style={styles.refreshBtn}>
                <FontAwesome
                  style={styles.refreshIcon}
                  name="retweet"
                  color={"#fff"}
                  size={16}
                  onPress={readData}
                />
              </Text>
            </Button>
          </Block>
        </Block>
        <Block row style={styles.topButton1}>
          <Block flex left>
            <Button
              textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
              center
              color="info"
              style={styles.log}
              onPress={() => {
                handleJobissuePage(1);
              }}
            >
              Raise Issue
            </Button>
          </Block>

          {liveTrackingMessage == "1" && (
            <Block flex right>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
                center
                color="info"
                style={styles.log3}
                onPress={() => {
                  handleStartTracking(1);
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  "Start Live Tracking"
                )}
              </Button>
            </Block>
          )}

          {liveTrackingMessage == "2" && (
            <Block flex right>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 11 }}
                center
                color="info"
                style={styles.log4}
                onPress={() => {
                  handleStartTracking(2);
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  "Stop Live Tracking"
                )}
              </Button>
            </Block>
          )}
        </Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
           refreshControl={
                          <RefreshControl refreshing={refreshing} onRefresh={readData} />
                        }
        >
          <Customerdetail jobDetail={{ jobDetail }} />
          <Jobdetail jobDetail={{ jobDetail }} />
          <JobOtherDetail jobDetail={{ jobDetail }} />
        </ScrollView>
        <Block row space="between" style={styles.JobButton}>
          {jobDetail && jobDetail.isfinish == 0 ? (
            <>
              {jobDetail &&
              jobDetail.isstarted == 0 &&
              jobDetail.isfinish == 0 ? (
                <Block flex center>
                  <Button
                    textStyle={{
                      fontFamily: "montserrat-regular",
                      fontSize: 13,
                    }}
                    onPressIn={() => handleStartFinishJob("ST")}
                    small
                    center
                    color="success"
                    style={styles.optionsButtonStart}
                    round
                  >
                    Start Job
                  </Button>
                </Block>
              ) : null}

              {jobDetail &&
              jobDetail.isstarted > 0 &&
              jobDetail.start_Stop_Flag == 1 ? (
                <>
                  <Button
                    onPressIn={() => handleStartFinishJob("PS")}
                    textStyle={{
                      fontFamily: "montserrat-regular",
                      fontSize: 13,
                    }}
                    center
                    color="info"
                    style={styles.optionsButtonFinish}
                    round
                  >
                    Pause Job
                  </Button>

                  <Button
                    //onPress={() => handleStartFinishJob("FN")}
                    onPress={() => handleOpenPopUp(1)}
                    textStyle={{
                      fontFamily: "montserrat-regular",
                      fontSize: 13,
                    }}
                    center
                    color="info"
                    style={styles.FinishJob}
                    round
                  >
                    Finish Job
                  </Button>
                </>
              ) : null}

              {jobDetail &&
              jobDetail.isstarted > 0 &&
              jobDetail.start_Stop_Flag == 0 ? (
                <>
                  <Button
                    onPressIn={() => handleStartFinishJob("RS")}
                    textStyle={{
                      fontFamily: "montserrat-regular",
                      fontSize: 13,
                    }}
                    center
                    round
                    color="info"
                    style={styles.optionsButtonFinish}
                  >
                    Resume Job
                  </Button>

                  <Button
                    //onPress={() => handleStartFinishJob("FN")}
                    onPress={() => handleOpenPopUp(1)}
                    textStyle={{
                      fontFamily: "montserrat-regular",
                      fontSize: 13,
                    }}
                    center
                    round
                    color="info"
                    style={styles.FinishJob}
                  >
                    Finish Job
                  </Button>
                </>
              ) : null}
            </>
          ) : (
            <Block flex center style={styles.JobDoneBtn}>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 12 }}
                onPressIn={() => handleRedirect("1")}
                center
                color="info"
                style={styles.JobDone}
                round
              >
                Job Done, Proceed To Pay
              </Button>
            </Block>
          )}
        </Block>
      </Block>

      <Block>
        <Modal
          style={styles.modalBack}
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Block>
                <Text style={styles.modalText}>
                  Are you sure you want to finish this job?
                </Text>
              </Block>

              <Block row style={styles.btnBlock}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle1}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.4}
                  style={[styles.button, styles.buttonSend]}
                  onPress={() => handleProceedButton(1)}
                >
                  <Text style={styles.textStyle1}>Yes</Text>
                </TouchableOpacity>
              </Block>
            </View>
          </View>
        </Modal>
      </Block>

      <Block>
        <Modal
          style={styles.modalBack}
          animationType="fade"
          transparent={true}
          visible={alertFlag}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setAlertFlag(!alertFlag);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Block>
                <Text style={styles.modalText}>{alertMessage}</Text>
              </Block>

              <Block center style={styles.btnBlockForLiveTracking}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  style={[styles.button, styles.buttonCloseForLiveTracking]}
                  onPress={() => setAlertFlag(!alertFlag)}
                >
                  <Text style={styles.textStyle1}>Okay</Text>
                </TouchableOpacity>
              </Block>
            </View>
          </View>
        </Modal>
      </Block>
    </Block>
   </SafeAreaView>

    // </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 10,
    padding:10,
    backgroundColor: "#fff",
    paddingTop: 10,
    // width: width,
    // height: height,
  },
  Headers: {
    backgroundColor: "#3498DB",
    padding: 15,
  },
  btnBlock: {
    marginTop: 15,
  },

  btnBlockForLiveTracking: {
    marginTop: 20,
  },

  BackText: {
    // color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 3,
  },
  BackIcon: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
    marginRight: 10,
  },
  Joblisttitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },
  Jobrefresh: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 7,
    marginLeft: 3,
  },
  BusinessJob: {
    display: "flex",
    alignItems: "center",
  },
  articles: {
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    color: "#000",
    marginTop: 15,
  },
  log: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 120,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    margin: 0,
    marginRight: 10,
  },
  log1: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 35,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    margin: 0,
  },
  log2: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 150,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    margin: 0,
    marginLeft: 70,
    marginRight: 10,
  },
  log3: {
    backgroundColor: "#5fd27f",
    borderRadius: 50,
    width: 200,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    margin: 0,
    marginRight: 10,
  },
  log4: {
    backgroundColor: "#F66262",
    borderRadius: 50,
    width: 200,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    margin: 0,
    marginRight: 10,
  },
  CustomerImages: {
    backgroundColor: "#CBC5C6",
    borderRadius: 50,
    width: 150,
    textTransform: "capitalize",
    height: 25,
    fontSize: 12,
    margin: 0,
    marginLeft: 70,
    marginRight: 10,
  },

  CustomerImagesOne: {
    backgroundColor: "#CBC5C6",
    borderRadius: 50,
    color: "#FFF",
    width: 110,
    textTransform: "capitalize",
    height: 25,
    fontSize: 11,
    margin: 0,
    marginLeft: 100,
  },

  JobButton: {
    position: "absolute",
    width: width,
    bottom: 40,
    backgroundColor: "#fff",
    zIndex: 999,
    right: -10,
    height: 135,
  },
  optionsButtonStart: {
    backgroundColor: "#5fd27f",
    width: 114,
    height: 32,
    marginHorizontal: 5,
    elevation: 0,
    bottom: 45,
  },
  optionsButtonFinish: {
    backgroundColor: "#5fd27f",
    width: 110,
    height: 31,
    marginHorizontal: 5,
    elevation: 0,
  },
  FinishJob: {
    backgroundColor: "#5fd27f",
    width: 110,
    height: 31,
    marginHorizontal: 5,
    elevation: 0,
    marginRight: 25,
  },
  optionsButtonFinished: {
    backgroundColor: "#246a24",
    width: 114,
    height: 35,
    marginHorizontal: 5,
    elevation: 0,
  },
  JobDone: {
    backgroundColor: "#5fd27f",
    width: 180,
    height: 35,
    marginHorizontal: 5,
    elevation: 0,
    marginBottom: 110,
  },
  JobDoneBtn: {
    paddingTop: 10,
  },
  icons: {
    marginRight: -20,
    fontSize: 30,
  },
  topButton: {
    marginBottom: 10,
  },
  topButton1: {
    marginBottom: 10,
    marginRight: -13,
  },
  refreshBtn: {
    color: "#fff",
    fontSize: 13,
  },
  TimeBlock: {
    marginTop: 10,
  },
  modalBack: {
    backgroundColor: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#000",
    opacity: 0.9,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOpacity: 0,
    // shadowRadius: 0,
    // elevation: 200,
    borderWidth: 2,
    borderColor: "#C6C6C6",
    opacity: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    height: 35,
    width: 114,
    elevation: 5,
    textAlign: "center",
  },
  buttonOpen: {
    backgroundColor: "#808080",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    width: 50,
    padding: 5,
    height: 30,
  },

  buttonCloseForLiveTracking: {
    backgroundColor: "#2196F3",
    width: 70,
    padding: 5,
    height: 30,
  },
  textStyle1: {
    color: "white",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    fontSize: 12,
  },
  buttonSend: {
    backgroundColor: "#48BCC0",
    marginLeft: 10,
    width: 50,
    padding: 5,
    height: 30,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    paddingBottom: 3,
  },
  ListTitleLeftPOP: {
    color: "#000",
    paddingBottom: 5,
    fontSize: 12,
  },
  ListTitleRightPOP: {
    color: "#808080",
    paddingBottom: 5,
    fontSize: 12,
  },
  Timer: {
    marginTop: 4,
    backgroundColor: "#111",
    width: 110,
    textAlign: "center",
    marginLeft: -30,
    borderRadius: 50,
    height: 25,
    paddingLeft: 20,
    paddingTop: 3,
    color:'#fff'
  },
  timerIcon: {
    color: "green",
    width: 60,
  },
  dottGreen: {
    height: 11,
    width: 11,
    backgroundColor: "#23B94D",
    borderRadius: 50,
    marginLeft: 50,
    position: "relative",
    zIndex: 9,
    marginTop: 11,
  },
  dottRed: {
    height: 11,
    width: 11,
    backgroundColor: "#F40E27",
    borderRadius: 50,
    marginLeft: 50,
    position: "relative",
    zIndex: 9,
    marginTop: 11,
  },
});

export default Jobdetailpage;


// const stopwatchOptions = {
//   text: {
//     fontSize: 14,
//     color: '#FFF',
//     marginLeft: 7,
//   },
// };

const stopwatchOptions = {
  // container: {
  //   backgroundColor: '#333',
  //   padding: 20,
  //   borderRadius: 10,
  // },
  text: {
    fontSize: 12,
    color: '#fff',
  },
};
