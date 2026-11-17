// UpdateTime.js
import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
  FlatList,
  Modal,
  Keyboard,
} from "react-native";
import { Block, Button, Text } from "galio-framework";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { OverlaySpinner } from "../../utils/Spinner";
import { URLDRIVER, STORAGE_DRIVERID } from "../../utils/factory";
import Themes from "./Theme";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const timeOptions = [
  { label: "Select Time", value: 0 },
  { label: "0:30 Hour", value: 30 },
  { label: "1:00 Hour", value: 60 },
  { label: "1:30 Hour", value: 90 },
  { label: "2:00 Hour", value: 120 },
  { label: "2:30 Hour", value: 150 },
  { label: "3:00 Hour", value: 180 },
  { label: "3:30 Hour", value: 210 },
  { label: "4:00 Hour", value: 240 },
  { label: "4:30 Hour", value: 270 },
  { label: "5:00 Hour", value: 300 },
];

const CountdownTimer = ({ timeInSeconds }) => {
  const [timeLeft, setTimeLeft] = useState(timeInSeconds);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft % 10 === 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Animated.View style={[styles.countdownContainer, { opacity: fadeAnim }]}>
      <Text style={styles.countdownText}>{formatTime(timeLeft)}</Text>
      <Text style={styles.countdownLabel}>Time Remaining</Text>
    </Animated.View>
  );
};

const CustomDropdown = ({
  data,
  onSelect,
  defaultText,
  value,
  style,
  dropdownMaxHeight = 200,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (value) {
      const item = data.find((i) => i.value === value.value);
      setSelectedItem(item);
    }
  }, [value]);

  const toggleDropdown = () => {
    Keyboard.dismiss();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item);
    setIsOpen(false);
  };

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedItem?.value === item.value && styles.dropdownItemSelected,
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
      {selectedItem?.value === item.value && (
        <FontAwesome name="check" size={16} color="#5fd27f" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedItem && styles.placeholderText,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedItem ? selectedItem.label : defaultText}
        </Text>
        <FontAwesome
          name={isOpen ? "angle-up" : "angle-down"}
          size={20}
          color="#888"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownList, { maxHeight: dropdownMaxHeight }]}>
          <FlatList
            data={data}
            renderItem={renderDropdownItem}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.dropdownContent}
          />
        </View>
      )}
    </View>
  );
};

const Header = ({ title, navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <FontAwesome name="arrow-left" size={20} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ width: 40 }} />
  </View>
);

const UpdateTime = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTime, setAvailableTime] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchDriverJobs();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchDriverJobs = async () => {
    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = { DriverId: driverid };

    try {
      setShowSpinner(true);
      const response = await axios.post(URLDRIVER + "DriverJobsSelect", json, {
        headers: {
          Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
          "Content-Type": "application/json",
        },
      });

      const responseData = response.data;
      if (responseData && responseData.length > 0) {
        const formattedJobs = responseData.map((item) => ({
          label: item.destaddress,
          value: item.jobid,
          availTime: item.availTime,
        }));
        setJobs([{ label: "Select Job", value: 0 }, ...formattedJobs]);
        setAvailableTime(formattedJobs[0]?.availTime || 0);
      }
    } catch (error) {
      console.log("API error", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleTimeUpdate = async () => {
    if (!selectedJob || selectedJob.value === 0) {
      alert("Please select a job");
      return;
    }
    if (!selectedTime || selectedTime.value === 0) {
      alert("Please select time");
      return;
    }

    const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);
    const json = {
      DriverId: driverid.toString(),
      JobId: selectedJob.value.toString(),
      FreeTime: selectedTime.value.toString(),
    };

    try {
      setShowSpinner(true);
      await axios.post(URLDRIVER + "DriverTimeUpdate", json, {
        headers: {
          Authorization: "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
          "Content-Type": "application/json",
        },
      });
      alert("Time updated successfully");
      fetchDriverJobs();
    } catch (error) {
      console.log("API error", error);
      alert("Failed to update time");
    } finally {
      setShowSpinner(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setAvailableTime(job.availTime || 0);
  };

  return (
    <SafeAreaWrapper>
    <Block style={styles.container}>
      <Header title="Update Availability" navigation={navigation} />
      {showSpinner && <OverlaySpinner />}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Block style={styles.section}>
          <Text style={styles.sectionTitle}>Current Availability</Text>
          {availableTime > 0 && <CountdownTimer timeInSeconds={availableTime} />}
        </Block>

        <Block style={styles.section}>
          <Text style={styles.sectionTitle}>Select Job</Text>
          <CustomDropdown
            data={jobs}
            onSelect={handleJobSelect}
            defaultText="Select job"
            value={selectedJob}
            dropdownMaxHeight={300}
          />
        </Block>

        <Block style={styles.section}>
          <Text style={styles.sectionTitle}>Set Available Time</Text>
          <CustomDropdown
            data={timeOptions}
            onSelect={setSelectedTime}
            defaultText="Select time"
            value={selectedTime}
          />
        </Block>
      </ScrollView>

      <Block style={styles.footer}>
        <Button
          round
          onPress={handleTimeUpdate}
          color="#5fd27f"
          style={styles.updateButton}
          textStyle={styles.updateButtonText}
        >
          UPDATE
        </Button>
      </Block>
    </Block>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  contentContainer: { padding: 20, paddingBottom: 100 },
  headerContainer: {
    height: 60,
    backgroundColor: Themes.COLORS.HEADER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 12 },
  countdownContainer: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#5fd27f",
  },
  countdownText: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  countdownLabel: { fontSize: 14, color: "#fff", marginTop: 5 },
  dropdownContainer: { position: "relative", marginTop: 5 },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 50,
  },
  dropdownButtonText: { fontSize: 15, color: "#333", flex: 1, marginRight: 10 },
  placeholderText: { color: "#999" },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
    overflow: "hidden",
  },
  dropdownContent: { paddingVertical: 5 },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemSelected: {
    backgroundColor: "#f1f1f1",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  updateButton: {
    width: "100%",
    height: 50,
    backgroundColor: Themes.COLORS.HEADER_COLOR,
    shadowColor: "#5fd27f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default UpdateTime;
