import React from "react";
// const axios = require('axios');
import { Dimensions, StyleSheet } from "react-native";
// galio component
import { Block, Text, theme } from "galio-framework";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// const {height, width} = Dimensions.get('window');

const JobOtherDetail = ({ navigation, route, style, jobDetail }) => {
  const data = jobDetail && jobDetail.jobDetail;
  return (
    <Block style={styles.cardContainer}>
      <Block row style={styles.Customerdetails}>
        <Block flex>
          <Text
            size={14}
            style={styles.cardTitle}
            color="white"
          >
            Other Details
          </Text>
        </Block>
      </Block>
      <Block style={styles.CustomerdetailList}>
        <Block>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              //color={theme.COLORS.SECONDARY}
            >
              Driver Notes by Office
            </Text>
          </Block>

          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={[styles.ListTitleRight, styles.notes]}
              // style={{backgroundColor:'#fff'}}
             /// color={theme.COLORS.SECONDARY}
            >
              {data.driver_instruction}
            </Text>
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
              color={theme.COLORS.SECONDARY}
            >
              Driver Notes by Customer
            </Text>
          </Block>

          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={[styles.ListTitleRight,styles.notes]}
              color={theme.COLORS.SECONDARY}
            >
              {data.client_instruction}
              {/* Driver Notes by Customer Data */}
            </Text>
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
              color={theme.COLORS.SECONDARY}
            >
              Goods Summary
            </Text>
          </Block>

          <Block flex>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={[styles.ListTitleRight,styles.notes]}
              color={theme.COLORS.SECONDARY}
            >
              {data.goods_Summary}
              {/* Goods Summary Data */}
            </Text>
          </Block>
        </Block>
        <Block row></Block>
        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Travel Time
            </Text>
          </Block>

          <Block flex right>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.travelTime}
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Minimum Booking Time
            </Text>
          </Block>

          <Block flex right>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.minBkghrs}
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Customer Ref Number
            </Text>
          </Block>

          <Block flex right>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.refNo}
            </Text>
          </Block>
        </Block>

        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Pick-up Floor
            </Text>
          </Block>

          <Block flex right>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.floor}
            </Text>
          </Block>
        </Block>

        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Drop-off Floor
            </Text>
          </Block>

          <Block flex right>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.floor_dropoff}
            </Text>
          </Block>
        </Block>

        <Block row>
          <Block>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Move Type
            </Text>
          </Block>

          <Block flex right>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.movetype}
            </Text>
          </Block>
        </Block>

       
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderWidth: 0.1,
    textAlign: "center",
    marginBottom: 100,
    paddingBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom:140
  },
  Customerdetails: {
    backgroundColor: "#F66262",
    padding: 5,
    height: 30,
    borderRadius: 10,
  },
  CustomerdetailList: {
    padding: 15,
    lineHeight: 30,
  },
  ListTitleLeft: {
    color: "#000",
    fontSize: 12,
    paddingBottom: 5,
  },
  ListTitleRight: {
    color: "#848484",
    fontSize: 12,
    paddingBottom: 5,
  },
  notes:{
    color: "#848484",
    fontSize: 12,
    backgroundColor: "#F6F6F6",
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  cardTitle:{
    height:20,
    paddingLeft:10,
    textTransform:'uppercase'
  }
});

export default JobOtherDetail;
