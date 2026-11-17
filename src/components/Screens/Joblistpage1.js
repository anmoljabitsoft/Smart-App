import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  BackHandler,
  Image,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  View
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
// galio component//refresh
import { Block, Button, Text, theme } from "galio-framework";
import {
  URL,
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URLDRIVER,
  STORAGE_NAME,
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Linking } from "react-native";
import BlinkingText from "../../utils/BlinkingText";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";

const { height, width } = Dimensions.get("window");

const Joblistpage = ({ navigation }) => {
  const [joblist, setjoblist] = useState([]);
  const [joblistcopy, setjoblistCopy] = useState([]);
  const [allPickupAddresses, setAllPickupAddresses] = useState([]);
  const [showSpinner, setshowSpinner] = useState(false);
  const [jobDetail, setJobDetail] = useState([]);
  const [jobFilter, setJobFilter] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [nodata, setNoData] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [userName, setUserName] = useState(null);

  const dataDrop = [
    { id: 1, name: "Option 1" },
    { id: 2, name: "Option 2" },
  ];

  // const [timerWork, setTimerWork] = useState(0);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      readData();
    });
    return unsubscribe;
  }, [navigation == 1]);

  // hide for jsut while time

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // navigation.navigate("ThirdPage");
  //       // Return true to stop default back navigaton
  //       // Return false to keep default back navigaton
  //       return true;
  //     };

  //     // Add Event Listener for hardwareBackPress
  //     BackHandler.addEventListener("hardwareBackPress", onBackPress);

  //     return () => {
  //       // Once the Screen gets blur Remove Event Listener
  //       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  //     };
  //   }, [])
  // );

  const readData = async () => {
    setjoblist([]);
    setjoblistCopy([]);
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid,
    };
    const map = [];
    const maps = [];

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
          console.log("sdsdasadadsdsdsd",response.data);
          if (response.status == 200) {
            const newdata = JSON.parse(allData);
            console.log("NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",newdata);
            for (var i = 0; i < newdata.length; i++) {
              const allpickup = newdata[i].pickupAddresses;

              const filterData = newdata[i].filters;
              setJobFilter(filterData);
              if (allpickup) {
                allpickup.forEach((item) => {
                  map.push({
                    address: item.address,
                    jobId: item.jobId,
                    name: item.name,
                    phone: item.phone,
                    addtype: item.addtype,
                  });
                });
                setAllPickupAddresses(map);
              }
            }

            if (response.status === 200) {
              if (response.data.length > 0) {
                const dropAdd = JSON.stringify(response.data);
                const fullAdd = JSON.parse(dropAdd);
                console.log("FDDDDADDDDDDDDDDDD1",dropAdd);
                console.log("FDDDDADDDDDDDDDDDD2",fullAdd);
                for (var x = 0; x < fullAdd.length; x++) {
                  const nameadd = fullAdd[x].dropAddresses;

                  console.log("NAMEEEEEEDDDDDDD",nameadd);   

                  if (nameadd) {
                    nameadd.forEach((item) => {
                      maps.push({
                        name: item.name,
                        phone: item.phone,
                        jobId: item.jobId,
                        address: item.address,
                        addtype: item.addtype,
                        isstarted: item.isstarted,
                        isfinish: item.isfinish,
                        jobDate: item.jobDate,
                      });
                    });
                    setJobDetail(maps);
                  }
                }
                setjoblist(response.data);
                setjoblistCopy(response.data);
              } else {
                setNoData(true);
              }
            } else {
              setNoData(true);
              setjoblist([]);
              setjoblistCopy([]);
            }
            setshowSpinner(false);
          }
        })
        .catch((error) => {
          console.log("API error", error);
          setshowSpinner(false);
         readData();
        })
        .finally(function () {
          // console.log('Finally Call');
        });
    } catch (error) {
      console.log(error);
      setshowSpinner(false);
       readData();
    }
  };

  console.log("dsdwsefwefwefwfw><>>>>>>>>>>",allPickupAddresses);
  console.log("Filters>>>>>>>>",jobFilter);
  useEffect(() => {
    if (selectedJob == "0") {
      setNoData(joblistcopy.length > 0 ? false : true);
      setjoblist(joblistcopy);
    } else if (selectedJob == "1") {
      const data = joblistcopy.filter(
        (filteredJob) => parseInt(filteredJob.isstarted) == 0
      );
      setNoData(data.length > 0 ? false : true);
      setjoblist(data);
    } else if (selectedJob == "2") {
      const data = joblistcopy.filter(
        (filteredJob) =>
          parseInt(filteredJob.isstarted) > 0 &&
          parseInt(filteredJob.isfinish) == 0
      );
      setNoData(data.length > 0 ? false : true);
      setjoblist(data);
    } else if (selectedJob == "3") {
      const data = joblistcopy.filter(
        (filteredJob) => parseInt(filteredJob.isfinish) == 1
      );
      setNoData(data.length > 0 ? false : true);
      setjoblist(data);
    }
  }, [selectedJob]);

  const handleRedirect = async (id, data, status) => {
    setshowSpinner(true);
    await AsyncStorage.setItem(STORAGE_JOBID, JSON.stringify(id));
      console.log("ddddddddddddddddd",{id, data, status});

    if (data >= 1 && status == 5) {
      navigation.navigate("FinishJobDetail");
    }

    else {
      handleTimer();
    }
  };

  const handleMakeCall = (type, number) => {
    if (type == 1) {
      Linking.openURL(`tel:${number}`);
    }
  };

  const openAddress = (type, location) => {
    const replaced = location.replace('/', ' ');
    if (type == 1) {
      Linking.openURL(`https://www.google.com/maps/search/${replaced}`);
    }
  };

  const handleTimer = async () => {
    // setTimerWork(0);
    
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);
    console.log("JobID>>>>>>>>>>>>>>",jobid);

    const json = {
      JobId: JSON.parse(jobid),
    };

    try {
      axios
        .post(URLDRIVER + "JobStartedTime", json, {
          headers: {
            // Authorization:
            //   "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response.data;
          console.log("dddddddddddddddddsdadd",responseData);
          setshowSpinner(false);
          navigation.navigate("JobDetails", {
            paramKey: responseData.time && responseData.time,
          });
         
        })
        .catch((error) => {
          setshowSpinner(false);
          console.log("API error", error);
        })
        .finally(function () {
          setshowSpinner(false);
          // always executedr
        });
    } catch (error) {
      setshowSpinner(false);
      console.log(error);
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      readData();
    }, 2000);
  }, []);

  useEffect(()=>{
    const getUserName=async()=>{
     const username=await AsyncStorage.getItem(STORAGE_NAME);
     setUserName(username)
    }
    getUserName();
    
  },[])

  return (
    <Block flex  style={{ backgroundColor: "#F0F0F0" }}>
      {showSpinner && <OverlaySpinner />}
      <Block row style={styles.Headers}>
            <View style={styles.pageHeader}>
                  <View style={styles.headerLeft}>
                  <AntDesign name="arrowleft"
                   onPress={() => navigation.navigate("Dashboard")}
                  size={20} color="#333" style={{ marginRight: 5 }} />
                    <Text style={styles.pageTitle}> Job List</Text>
                  </View>
        </View>
        <Block flex right>
          <SelectDropdown
            data={dataDrop}
            defaultValueByIndex={0}
            // defaultValue={"All Jobs"}
            onSelect={(selectedItem, index) => {
              setSelectedJob(selectedItem.id);
            }}
            defaultButtonText={"All Jobs"}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#444"}
                  size={12}
                />
              );
            }}
            dropdownIconPosition={"right"}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />


        </Block>
      </Block>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}

        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Block style={styles.container}>
          {
            joblist &&
            joblist.length > 0 &&
            joblist.map((item, i) => (
             
              <Block style={styles.cardContainerOne} key={i}>
                <TouchableOpacity activeOpacity={0.4}
                  onPress={() =>
                    handleRedirect(item.jobId, item.isfinish, item.jobStatus)
                  }
                >
                  <Block
                    row
                    style={
                      item.jobType == "Business Account"
                        ? styles.CustomerdetailsGreen
                        : styles.CustomerdetailsOne
                    }
                  >
                    <Block flex>
                      <Text
                       
                        size={14}
                  
                        style={styles.cardTitle}
                        color={theme.COLORS.SECONDARY}
                  
                      >
                        Job ID : {item.jobId}
                      </Text>
                      <Text
                        size={10}
                        // eslint-disable-next-line react/jsx-no-duplicate-props
                        style={styles.cardDate}
                        //style={{ fontFamily: "montserrat-regular" }}
                        color={theme.COLORS.SECONDARY}
                      >
                        {item.jobDate}
                      </Text>
                    </Block>

                    <Block flex right>
                      <Text
                        style={styles.cardTitleTypeBlue}
                        color={theme.COLORS.SECONDARY}
                      >
                        {item.jobType}
                      </Text>
                      <Text
                        style={styles.cardTitleTypeBlue}
                        color={theme.COLORS.SECONDARY}
                      >
                        {item.isstarted == 0
                          ? "Not started"
                          : item.isfinish >= 1
                            ? "Finished"
                            : item.isstarted > 0 && item.isfinish == 0
                              ? <BlinkingText text="In Progress" />
                              : null}
                      </Text>
                    </Block>
                  </Block>
                </TouchableOpacity>

                <Block card flex style={styles.Jobdetail}>
                  <Block row style={{ padding: 10 }}>
                    <Block flex center>
                      <Block left row style={{ paddingRight: 10 }}>
                        <Text
                          style={
                            item.jobType == "Business Account"
                              ? styles.BoxSubTitleNameGreen
                              : styles.BoxSubTitleNameRed
                          }
                        //size={15}
                        //color="#4B4B4B"
                        >
                          {item.customerName}
                        </Text>
                      </Block>
                    </Block>
                  </Block>

                  <Block flex row>
                    <Text
                      size={13}
                      color="#000"
                      style={{
                        paddingLeft: 10,
                        marginTop: 0,
                      }}
                    >
                      Phone
                    </Text>
                  </Block>
                  <Block row style={styles.pickupAddress}>
                    <Block row style={{ paddingLeft: 10, marginBottom: 0 }}>
                      <FontAwesome name="phone" style={styles.iconstwo} />
                      <Text
                        style={styles.BoxSubTitleLink}
                        size={15}
                        color="black"
                        onPress={() => handleMakeCall("1", item.customerMobile)}
                      >
                        {item.customerMobile}
                      </Text>
                    </Block>
                  </Block>

                  <Block flex row>
                    <Text
                      size={13}
                      color="#000"
                      style={{
                        paddingLeft: 10,
                        marginTop: 0,
                      }}
                    >
                      Pickup Addresses 1111111: 
                    </Text>
                  </Block>
                  <Block style={{ paddingLeft: 10, paddingBottom: 5 }}>
                    
               
                    {allPickupAddresses &&
                      allPickupAddresses.length &&
                      allPickupAddresses
                        .filter((id) => id.jobId == item.jobId)
                        .map((address, i) => (
                          <Block key={i}>
                            {address.addtype == "2" ? (
                              <>
                                <Block style={styles.pickupAddress}>
                                  <Block style={{ marginBottom: 6 }}>
                                    {address.name !== "" ? (
                                      <Block row>
                                        {address.name !== "" ? (
                                          <FontAwesome
                                            name="user"
                                            style={styles.iconstwo}
                                          />
                                        ) : null}
                                        <Text
                                          style={styles.BoxSubTitleLink}
                                          size={14}
                                          color="black"
                                        >
                                          {address.name !== ""
                                            ? address.name
                                            : null}
                                        </Text>
                                      </Block>
                                    ) : null}
                                  </Block>
                                  <Block style={{ marginBottom: 6 }}>
                                    {address.phone !== "" ? (
                                      <Block row left>
                                        {address.phone !== "" ? (
                                          <FontAwesome
                                            name="phone"
                                            style={styles.iconstwo}
                                          />
                                        ) : null}
                                        <Text
                                          style={styles.BoxSubTitleLink}
                                          size={14}
                                          color="black"
                                        >
                                          {address.phone !== ""
                                            ? address.phone
                                            : null}
                                        </Text>
                                      </Block>
                                    ) : null}
                                  </Block>

                                  <Block style={{ marginBottom: 6 }}>
                                    {address.addtype == "2" ? (
                                      <Block row>
                                        <FontAwesome
                                          name="home"
                                          style={styles.iconstwo}
                                        />
                                        <Text
                                          style={styles.BoxSubTitleLink}
                                          size={14}
                                          color="black"
                                          onPress={() =>
                                            openAddress(1, address.address)
                                          }
                                        >
                                          {address.address}
                                        </Text>
                                      </Block>
                                    ) : null}
                                  </Block>
                                </Block>
                              </>
                            ) : (
                              <>
                               
                                <Block row style={styles.pickupAddress}>
                                  <Block row>
                                    <FontAwesome
                                      name="home"
                                      style={styles.iconstwo}
                                    />
                                    <Text
                                      style={styles.BoxSubTitleLink}
                                      size={14}
                                      color="black"
                                      onPress={() =>
                                        openAddress(1, address.address)
                                      }
                                    >
                                      {address.address}
                                    </Text>
                                  </Block>
                                </Block>
                                {/* </Pressable> */}
                              </>
                            )}
                          </Block>
                        ))}
                  </Block>

                  <Block flex row>
                    <Text
                      size={14}
                      color="#000"
                      style={{ paddingLeft: 10, marginTop: 0 }}
                    >
                      Drop Addresses
                    </Text>
                  </Block>
                  <Block style={{ paddingLeft: 10, paddingBottom: 5 }}>
                    {jobDetail &&
                      jobDetail.length &&
                      jobDetail
                        .filter((id) => id.jobId == item.jobId)
                        .map((name, i) => (
                          <Block key={i}>
                            {name.addtype == "2" ? (
                              <>
                                <Block style={styles.pickupAddress}>
                                  <Block style={{ marginBottom: 6 }}>
                                    {name.name !== "" ? (
                                      <Block row>
                                        {name.name !== "" ? (
                                          <FontAwesome
                                            name="user"
                                            style={styles.iconstwo}
                                          />
                                        ) : null}
                                        <Text
                                          style={styles.BoxSubTitleLink}
                                          size={14}
                                          color="black"
                                        >
                                          {name.name !== "" ? name.name : null}
                                        </Text>
                                      </Block>
                                    ) : null}
                                  </Block>

                                  <Block style={{ marginBottom: 6 }}>
                                    {name.phone !== "" ? (
                                      <Block row left>
                                        {name.phone !== "" ? (
                                          <FontAwesome
                                            name="phone"
                                            style={styles.iconstwo}
                                          />
                                        ) : null}
                                        <Text
                                          style={styles.BoxSubTitleLink}
                                          size={14}
                                          color="black"
                                          onPress={() =>
                                            handleMakeCall("1", name.phone)
                                          }
                                        >
                                          {name.phone !== ""
                                            ? name.phone
                                            : null}
                                        </Text>
                                      </Block>
                                    ) : null}
                                  </Block>

                                  {name.addtype == "2" ? (
                                    <Block row>
                                      <FontAwesome
                                        name="home"
                                        style={styles.iconstwo}
                                      />
                                      <Text
                                        style={styles.BoxSubTitleLink}
                                        size={14}
                                        color="black"
                                        onPress={() =>
                                          openAddress(1, name.address)
                                        }
                                      >
                                        {name.address}
                                      </Text>
                                    </Block>
                                  ) : null}
                                </Block>
                              </>
                            ) : (
                              <>
                                <Block row style={styles.pickupAddress}>
                                  <Block row>
                                    <FontAwesome
                                      name="home"
                                      style={styles.iconstwo}
                                    />
                                    <Text
                                      style={styles.BoxSubTitleLink}
                                      size={14}
                                      color="black"
                                      onPress={() =>
                                        openAddress(1, name.address)
                                      }
                                    >
                                      {name.address}
                                    </Text>
                                  </Block>
                                </Block>
                              </>
                            )}
                          </Block>
                        ))}
                  </Block>
                 
                </Block>
              </Block>
             
            ))
          }

          {joblist && joblist.length == 0 && nodata == true &&
            // <Image source={require('../images/NoRecordFound.png')}>
            < Block center style={styles.ViewImage}>
              <Image
                style={styles.NoRecordImage}
                // source={require("../images/NoRecordFound.png")}
                source={require("../../images/3371471.jpg")}
              ></Image>
              <Text>No Record Found</Text>
            </Block>
          }

        </Block>
      </ScrollView >
    </Block >
  );
};


const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  
  cardContainerOne: {
    backgroundColor: "#dedede",
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  Headers: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2,
  },
  BackText: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
  BackIcon: {
    color: theme.COLORS.BLACK,
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
  Joblisttitle: {
    color: "#464646",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
    textTransform: "uppercase",
  },
  CustomerdetailsOne: {
    backgroundColor: "#FA6E6E",
    padding: 7,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  CustomerdetailsGreen: {
    backgroundColor: "#58CD85",
    padding: 7,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  container: {
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "#fff",
    paddingTop: 10,
    width: width,
    height: "auto",
  },
  cardTitle: {
    color: "#ffff",
    fontSize: 14,
    paddingLeft: 10,
  },
  cardDate: {
    color: "#ffff",
    fontSize: 10,
    paddingLeft: 10,
  },
  cardTitleTypeBlue: {
    color: "#fff",
    paddingRight: 10,
    fontSize: 10,
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
    marginRight: 7,
    marginTop: 3,
    color: "#848484",
  },
  Divider: {
    borderColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 20,
  },

  BoxSubTitle: {
    color: "#2945D3",
    fontSize: 14,
    marginTop: 0,
    flexWrap: "wrap",
    flexShrink: 1,
    //letterSpacing: 0.4,
    //fontFamily: "lucida grande",
  },
  BoxSubTitleNameGreen: {
    color: "#3C8541",
    fontSize: 14,
    marginTop: 0,
    flexWrap: "wrap",
    flexShrink: 1,
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  BoxSubTitleNameRed: {
    color: "#A51515",
    fontSize: 14,
    marginTop: 0,
    flexWrap: "wrap",
    flexShrink: 1,
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  BoxSubTitleLink: {
    color: "#0095DF",
    fontSize: 12,
    marginTop: 0,
    flexWrap: "wrap",
    flexShrink: 1,
    //letterSpacing: 0.4,
    //fontFamily: "lucida grande",
  },
  Jobdetail: {
    borderWidth: 0,
    backgroundColor: "#fff",
    marginTop: -6.5,
    paddingBottom: 10,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 30,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999",
    zIndex: 1000, 
  },
  dropdown1BtnTxtStyle: { textAlign: "left", color: "black", fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#FFF",
    borderBottomColor: "#C5C5C5",
    height: 30,
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left", fontSize: 12 },
  NoRecordImage: {
    width: 200,
    height: 200,
  },
  ViewImage: {
    paddingTop: 90,
    textAlign: "center",
    backgroundColor: "#fff",
    height: height,
  },
  PageHeader: {
    backgroundColor: "#000",
  },
  addresses: {
    paddingTop: 10,
  },
  pickupAddress: {
    //backgroundColor: "#D3D3D3",
    width: 310,
    padding: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
  },
  Joblisttitlerefresh: {
    paddingLeft: 5,
    paddingTop: 7,
  },
});

export default Joblistpage;
