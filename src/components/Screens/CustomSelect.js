import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CustomSelect = ({
  data = [],
  placeholder = 'Select an option',
  onSelect,
  selectedValue,
  searchable = true,
  clearable = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = data.filter((item) =>
      item.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSelect = (item) => {
    onSelect(item);
    handleClose();
  };

  const handleClear = () => {
    onSelect(null);
    setSearch('');
    setFilteredData(data);
  };

 const handleOpen = () => {
     setFilteredData(data);
     setModalVisible(true);
     Animated.timing(rotateAnim, {
       toValue: 1,
       duration: 200,
       useNativeDriver: true,
     }).start();
   };
 
   const handleClose = () => {
     setModalVisible(false);
     setSearch('');
     Animated.timing(rotateAnim, {
       toValue: 0,
       duration: 200,
       useNativeDriver: true,
     }).start();
   };

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.selectBox, 
          modalVisible && styles.selectBoxFocused
        ]} 
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text 
          style={selectedValue ? styles.selectedText : styles.placeholder}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedValue ? selectedValue.label : placeholder}
        </Text>
        <View style={styles.rightSection}>
          {clearable && selectedValue && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              style={styles.clearButton}
            >
              <Icon name="close" size={18} color="#888" />
            </TouchableOpacity>
          )}
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <Icon name="keyboard-arrow-down" size={24} color="#555" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View 
            style={[
              styles.bottomDrawer,
              // { transform: [{ scale: scaleAnim }] }
            ]}
          >
            {searchable && (
              <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={handleSearch}
                  placeholder="Search..."
                  placeholderTextColor="#888"
                  autoFocus={true}
                />
                {search.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => handleSearch('')}
                    style={styles.clearSearchButton}
                  >
                    <Icon name="close" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedValue?.value === item.value && styles.optionSelected
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {selectedValue?.value === item.value && (
                    <Icon name="check" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.noDataContainer}>
                  <Icon name="search-off" size={40} color="#ccc" />
                  <Text style={styles.noDataText}>No options found</Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
            />
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 9,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
  },
  selectBoxFocused: {
    borderColor: '#3498DB',
    shadowColor: '#3498DB',
    shadowOpacity: 0.2,
  },
  placeholder: {
    color: '#888',
    // fontSize: 16,
    flex: 1,
  },
  selectedText: {
    color: 'gray',
    // fontSize: 14,
    // fontWeight: '500',
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  clearButton: {
    padding: 4,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomDrawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearSearchButton: {
    padding: 4,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 10,
  },
  closeBtn: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});