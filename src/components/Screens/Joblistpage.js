import React, { useEffect, useState, useRef } from "react";
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
  View,
  Modal,
  Animated
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text, theme } from "galio-framework";
import {
  URL,
  STORAGE_DRIVERID,
  STORAGE_JOBID,
  URLDRIVER,
  STORAGE_NAME,
} from "../../utils/factory";
import { OverlaySpinner } from "../../utils/Spinner";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Linking } from "react-native";
import BlinkingText from "../../utils/BlinkingText";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Themes from './Theme';
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const CustomDropdown = ({ data, onSelect, defaultText,selectedValue }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(selectedValue || null);
  // const [selectedValue1, setSelectedValue1] = useState(selectedValue || null);

  const [animation] = useState(new Animated.Value(0));
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleDropdown = () => {
    if (!visible && dropdownRef.current) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py + height + 5, // 5px below the button
          left: px
        });
      });
    }
    setVisible(!visible);
  };

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  useEffect(() => {
      setSelected(selectedValue || null); // Set to first item ("All Jobs") when selection is cleared
  }, [selectedValue]);


  return (
    <View style={styles.customDropdownContainer} ref={dropdownRef}>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={toggleDropdown}
      >
        <Text style={styles.dropdownButtonText}>
          {selected ? selected.name : defaultText}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <FontAwesome name="chevron-down" size={12} color="#444" />
        </Animated.View>
      </TouchableOpacity>
      
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity 
          style={styles.dropdownOverlay} 
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdownMenu, { 
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }]}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  selected?.id === item.id && styles.dropdownItemSelected
                ]}
                onPress={() => onItemPress(item)}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
                {selected?.id === item.id && (
                  <FontAwesome name="check" size={12} color="#444" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
    { id: "0", name: "All Jobs" },
    { id: "1", name: "Not Started" },
    { id: "2", name: "In Progress" },
    { id: "3", name: "Finished" },
  ];

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      readData();
    });
    return unsubscribe;
  }, [navigation == 1]);

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
          if (response.status == 200) {
            const newdata = JSON.parse(allData);
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
                for (var x = 0; x < fullAdd.length; x++) {
                  const nameadd = fullAdd[x].dropAddresses;

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
    const jobid = await AsyncStorage.getItem(STORAGE_JOBID);

    const json = {
      JobId: JSON.parse(jobid),
    };

    try {
      axios
        .post(URLDRIVER + "JobStartedTime", json, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const responseData = response.data;
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
        });
    } catch (error) {
      setshowSpinner(false);
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setSelectedJob("")
    setTimeout(() => {
      setRefreshing(false);
      readData();
    }, 2000);
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      const username = await AsyncStorage.getItem(STORAGE_NAME);
      setUserName(username)
    }
    getUserName();
  }, [])

  return (
    <SafeAreaWrapper>
     
    <Block flex style={{ backgroundColor: "#F0F0F0" }}>
      {showSpinner && <OverlaySpinner />}
      <Block row style={styles.Headers}>
        <View style={styles.pageHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity  onPress={() => navigation.navigate("Dashboard")}>
            <AntDesign
              name="arrowleft"
              size={20}
              style={[styles.BackIcon,{ marginRight: 5 }]}
            />
            </TouchableOpacity>
            
            <Text style={styles.pageTitle}> Job List</Text>
          </View>
        </View>
        <Block flex right>
          <CustomDropdown
            data={dataDrop}
            onSelect={(item) => setSelectedJob(item.id)}
            defaultText="All Jobs"
            selectedValue={selectedJob == "0" || !selectedJob ? dataDrop[0] : dataDrop.find(item => item.id == selectedJob)}
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
              <TouchableOpacity activeOpacity={0.4} key={i}
                  onPress={() =>
                    handleRedirect(item.jobId, item.isfinish, item.jobStatus)
                  }
                >
              <Block style={styles.cardContainerOne} >
                
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
                        style={styles.cardDate}
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
                      Pickup Addresses 
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
              </TouchableOpacity>
            ))
          }

          {joblist && joblist.length == 0 && nodata == true &&
            <Block center style={styles.ViewImage}>
              <Image
                style={styles.NoRecordImage}
                source={require("../../images/3371471.jpg")}
              ></Image>
              <Text>No Record Found</Text>
            </Block>
          }
        </Block>
      </ScrollView>
    </Block>
    </SafeAreaWrapper>
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
    color: '#fff',
  },
  cardContainerOne: {
    backgroundColor: "#dedede",
    borderWidth: 0,
    shadowColor: "#8898AA",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.9,
    elevation: 20,
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  Headers: {
    backgroundColor: Themes.COLORS.HEADER_COLOR,
    padding: 20,
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 2,
    color:"#fff"
  },
  BackText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
    paddingTop: 5,
  },
  BackIcon: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
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
    shadowColor: "#8898AA",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.9,
    elevation: 20,
    textAlign: "center",
    paddingTop: 20,
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
  },
  Jobdetail: {
    borderWidth: 0,
    backgroundColor: "#fff",
    marginTop: -6.5,
    paddingBottom: 10,
  },
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
  // Custom Dropdown Styles
  customDropdownContainer: {
    width: 120,
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    height: 30,
  },
  dropdownButtonText: {
    color: 'black',
    fontSize: 12,
    marginRight: 8,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dropdownMenu: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    width: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#444',
  },
});

export default Joblistpage;