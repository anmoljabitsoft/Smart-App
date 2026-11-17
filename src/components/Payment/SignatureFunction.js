import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Block } from "galio-framework";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignatureScreen from 'react-native-signature-canvas';
import { STORAGE_SIGN, STORAGE_SIGNATURE } from "../../utils/factory";

const SignaturePad = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [base64, setBase64] = useState(null);
  const signRef = useRef(null);

  const handleSave = (signature) => {
    setBase64(signature);
    AsyncStorage.setItem(STORAGE_SIGNATURE, signature);
    setModalVisible(false);
  };

  const handleClear = () => {
    signRef.current.clearSignature();
  };

  const handleDrag = async () => {
    await AsyncStorage.setItem(STORAGE_SIGN, "dragged");
  };

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
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Signature Here..</Text>
                <View style={{ height: 350, width: 300 }}>
                  <SignatureScreen
                    ref={signRef}
                    onOK={handleSave}
                    onBegin={handleDrag}
                    autoClear={false}
                    webStyle={style}
                  />
                </View>

                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => signRef.current.readSignature()}
                  >
                    <Text style={styles.textBtn}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonStyle1}
                    onPress={handleClear}
                  >
                    <Text style={styles.textBtn}>Reset</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonStyle1}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textBtn}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Block style={styles.btnStyle}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textStyle}>
                {base64 ? "Signature done, click to sign again" : "Customer signature here"}
              </Text>
            </TouchableOpacity>
          </Block>
        </View>
      </Block>

      <Block style={styles.CustomerdetailList}></Block>
    </Block>
  );
};

const style = `.m-signature-pad--footer {display: none; margin: 0px;} 
  .m-signature-pad {box-shadow: none; border: none;}`; // hides footer buttons of webview

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 5,
    elevation: 1,
  },
  buttonOpen: {
    backgroundColor: "#3498DB",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    padding: 10,
  },
  textBtn: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnStyle: {
    // marginTop: 5,
    width:"100%",
    margin:"auto"
  },
  CustomerdetailList: {
    padding: 0,
    lineHeight: 30,
  },
});

export default SignaturePad;
