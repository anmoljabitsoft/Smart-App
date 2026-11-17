import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomTimeDropdown = ({ data, onSelect, placeholder = "Select Time" }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    Animated.timing(rotateAnim, {
      toValue: isDropdownVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item);
    setDropdownVisible(false);
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>{selectedItem || placeholder}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Icon name="expand-more" size={16} color="#444" />
        </Animated.View>
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    height: 36,
  },
  buttonText: {
    fontSize: 12,
    color: "#333",
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    maxHeight: 120,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 12,
    color: "#333",
  },
});

export default CustomTimeDropdown;
