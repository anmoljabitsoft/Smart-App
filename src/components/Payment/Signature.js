var React = require("react");
var ReactNative = require("react-native");

var { Component } = React;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
  Modal,
} = ReactNative;

import { Block } from "galio-framework";

import AsyncStorage from '@react-native-async-storage/async-storage';

// import SignatureCapture from "react-native-signature-capture";

import { STORAGE_SIGN, STORAGE_SIGNATURE } from "../../utils/factory";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import SignatureScreen from 'react-native-signature-canvas';

//====================================================This is Old Component and it is not working now=================================
class Signature extends Component {
  constructor(props) {
    super(props);
    this.refs = React.createRef();
  }

  state = {
    modalVisible: false,
    base64: null,
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  _onSaveEvent(result) {
    this.setState({ base64: result.encoded });
    this.setModalVisible(false);
  }

  
  render() {
    AsyncStorage.setItem(STORAGE_SIGNATURE, this.state.base64);

    const { modalVisible } = this.state;
    return (
      <Block>
        <Block flex>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                this.setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.header}>Signature Here..</Text>
                  <View style={{ height: 350 }}>
                    {/* <SignatureCapture
                      style={[
                        { flex: 1, height: 400, width: 250 },
                        styles.signature,
                      ]}
                      ref="sign"
                      onSaveEvent={(e) => this._onSaveEvent(e)}
                      onDragEvent={this._onDragEvent}
                      saveImageFileInExtStorage={false}
                      showNativeButtons={false}
                      showTitleLabel={false}
                      backgroundColor="#FFFFFF"
                      strokeColor="#030303"
                      minStrokeWidth={4}
                      maxStrokeWidth={4}
                      viewMode={"portrait"}
                    /> */}
                    {/* <SignaturePad
                      style={{ flex: 1 }}
                      onChange={({ base64 }) => console.log(base64)}
                    /> */}
                  </View>

                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableHighlight
                      style={styles.buttonStyle}
                      onPress={() => {
                        this.saveSign();
                        // this.setModalVisible(!modalVisible)
                      }}
                    >
                      <Text>Save</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={styles.buttonStyle1}
                      onPress={() => {
                        this.resetSign();
                      }}
                    >
                      <Text>Reset</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={styles.buttonStyle1}
                      onPress={() => this.setModalVisible(!modalVisible)}
                    >
                      <Text>Cancel</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Modal>
            <Block style={styles.btnStyle}>
              <TouchableOpacity activeOpacity={0.4}
                style={[styles.button, styles.buttonOpen]}
                onPress={() => this.setModalVisible(true)}
              >
                <Text style={styles.textStyle}>
                  {this.state.base64 ? 'Signature done, click to sign again' : 'Customer signature here'}
                  {/* <FontAwesome5Icon
                    size={15}
                    style={{ marginRight: 10, marginLeft: 20 }}
                    name="signature"
                    family="NowExtra"
                  /> */}
                </Text>
              </TouchableOpacity>
            </Block>
          </View>
        </Block>
        <Block style={styles.CustomerdetailList}></Block>
      </Block>
    );
  }

  saveSign() {
    // alert("Signature saved successfully");
    this.refs["sign"].saveImage();
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }

  async _onDragEvent() {
    await AsyncStorage.setItem(STORAGE_SIGN, "dragged");
  }
}

const styles = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: "#000033",
    borderWidth: 1,
    height: 100,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    width: 1,
    backgroundColor: "#0FCA7D",
    borderRadius: 50,
    margin: 10,
  },

  buttonStyle1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    backgroundColor: "#ACB9BC",
    borderRadius: 50,
    margin: 10,
  },
  header: {
    textAlign: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    paddingBottom: 2,
    paddingBottom: 0,
    fontSize: 20,
    fontWeight: "bold",
  },
  allSignature: {
    borderWidth: 1,
    borderColor: "#979797",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    paddingBottom: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  cardContainer: {
    borderWidth: 0,
    textAlign: "center",
    marginBottom: -10,
    paddingBottom: 0,
    minHeight: 20,
  },
  cardTitle: {
    color: "#000",
    fontSize: 12,
    fontStyle: "italic",
  },
  Customerdetails: {
    padding: 10,
    borderRadius: 10,
  },
  CustomerdetailList: {
    padding: 0,
    lineHeight: 30,
  },
  ListTitleLeft: {
    color: "#000",
    paddingBottom: 5,
  },
  ListTitleRight: {
    color: "#000",
    paddingBottom: 5,
    fontStyle: "italic",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 3,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#3498DB",
  },
  buttonClose: {
    backgroundColor: "#3C3C3C",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    backgroundColor: "#3498DB",
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    width: 280,
    height: 25,
    marginTop: 0,
    marginBottom: -5,
  },
  textStyle1: {
    color: "white",
    textAlign: "center",
    backgroundColor: "#3C3C3C",
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    width: 50,
    height: 20,
    marginTop: -5,
    marginBottom: -5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  btnStyle: {
    textAlign: "center",
    marginTop: -10,
  },
});

export default Signature;
