import React from "react";
import { Alert, Dimensions, Pressable, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// galio component
import { Block, Text, theme } from "galio-framework";

import { Linking } from "react-native";

const Jobdetail = ({ jobDetail }) => {
  const data = jobDetail && jobDetail.jobDetail;
  const pickupAddress = data && data.pickupAddresses;
  const dropAddress = data && data.dropAddresses;

  // const openAddress = (type, location) => {

  //   const replaced = location.replace('/', ' ');

  //   if (type == 1) {
  //     Linking.openURL(`https://www.google.com/maps/search/${replaced}`);
  //   }
  // };

// New Code Implementation
const openAddress = (type, location) => {
  console.log("Location:::::::::::::",{type,location})
  if (type == 1 && location) {
    const encodedLocation = encodeURIComponent(location); // Safely encode special characters
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open Google Maps');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }
};

  const handleMakeCall = (type, number) => {
    if (type == 1) {
      Linking.openURL(`tel:${number}`);
    }
  };

  console.log("hhhhhhhhhhhhhhhhhhsssssssss",pickupAddress,data);

  return (
    <Block style={styles.cardContainer}>
      <Block row style={styles.Customerdetails}>
        <Block flex>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            // style={{fontFamily: 'montserrat-regular'}}
            size={14}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            style={styles.cardTitle}
            color="white"
          >
            Job Detail
          </Text>
        </Block>
      </Block>
      <Block style={styles.CustomerdetailList}>
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
              Job Date
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
              {data?.jobDate}
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block>
            <Text
              size={14}
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Start Time
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
              {data.jobTime}
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
            //color={theme.COLORS.SECONDARY}
            >
              Pickup Address
            </Text>
          </Block>

          <Block flex>
            {/* <Text
              // eslint-disable-next-line react-native/no-inline-styles
              // style={{fontFamily: 'montserrat-regular'}}
              size={14}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              style={(styles.ListTitleRight, styles.ListAddress)}
              color={theme.COLORS.SECONDARY}
              onPress={() => openAddress(1, data.pickupAddress)}
            >
              {data.pickupAddress}
            </Text> */}
            {pickupAddress &&
              pickupAddress.length &&
              pickupAddress
                .filter((id) => id.jobId === data.jobId)
                .map((address) => (
                  // <Pressable onPress={() => openAddress(1, data.pickupAddress)}>
                  <>
                    {address.addtype == "2" ? (
                      <>
                        <Block style={styles.pickupAddress}>
                          {address.name !== "" ? (
                            <Block row>
                              {address.name !== "" ? (
                                <FontAwesome
                                  name="user"
                                  style={styles.iconstwo}
                                />
                              ) : null}
                              <Text
                                style={styles.BoxSubTitle}
                                size={14}
                                // style={styles.ListTitleRight}
                              >
                                {address.name !== "" ? address.name : null}
                              </Text>
                            </Block>
                          ) : null}

                          {address.phone !== "" ? (
                            <Block row left>
                              {address.phone !== "" ? (
                                <FontAwesome
                                  name="phone"
                                  style={styles.iconstwo}
                                />
                              ) : null}
                              <Text
                                style={styles.BoxSubTitle}
                                size={14}
                                // style={styles.ListTitleRight}
                                onPress={() => handleMakeCall(1, address.phone)}
                              >
                                {address.phone !== "" ? address.phone : null}
                              </Text>
                            </Block>
                          ) : null}

                          {address.addtype == "2" ? (
                            <Block row>
                              <FontAwesome
                                name="home"
                                style={styles.iconstwo}
                              />
                              <Text
                                style={styles.BoxSubTitle}
                                size={14}
                                // style={styles.ListTitleRight}
                                onPress={() => openAddress(1, data.pickupAddresses[0]?.address)}
                              >
                                {address?.address}
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
                            <Text size={14} style={styles.ListTitleRight}
                              onPress={() => openAddress(1, data.pickupAddresses[0]?.address)}
                            >
                              {address.address}
                            </Text>
                          </Block>
                        </Block>
                      </>
                    )}
                  </>
                  // </Pressable>
                ))}
          </Block>
        </Block>
        <Block>
          <Block>
            <Text size={12} color="#000" style={{ marginTop: 10 }}>
              Drop Address
            </Text>
          </Block>

          <Block flex>
           
            {dropAddress &&
              dropAddress.length &&
              dropAddress
                .filter((id) => id.jobId === data.jobId)
                .map((name) => (
                  // <Pressable onPress={() => openAddress(1, data.dropAddress)}>
                  <>
                    {name.addtype == 2 ? (
                      <>
                        <Block style={styles.pickupAddress}>
                          {name.name !== "" ? (
                            <Block row>
                              {name.name !== "" ? (
                                <FontAwesome
                                  name="user"
                                  style={styles.iconstwo}
                                />
                              ) : null}
                              <Text
                                style={styles.BoxSubTitle}
                                size={14}
                                // style={styles.ListTitleRight}
                              >
                                {name.name !== "" ? name.name : null}
                              </Text>
                            </Block>
                          ) : null}

                          {name.phone !== "" ? (
                            <Block row left>
                              {name.phone !== "" ? (
                                <FontAwesome
                                  name="phone"
                                  style={styles.iconstwo}
                                />
                              ) : null}
                              <Text
                                style={styles.BoxSubTitle}
                                size={14}
                                // style={styles.ListTitleRight}
                                onPress={() => handleMakeCall(1, name.phone)}

                              >
                                {name.phone !== "" ? name.phone : null}
                              </Text>
                            </Block>
                          ) : null}

                          {name.addtype == "2" ? (
                            <Block row>
                              <FontAwesome
                                name="home"
                                style={styles.iconstwo}
                              />
                              <Text
                                style={styles.BoxSubTitle}
                                size={14}
                                // style={styles.ListTitleRight}
                                onPress={() => openAddress(1, data.dropAddresses[0]?.address)}

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
                            <Text size={14} style={styles.ListTitleRight}
                              onPress={() => openAddress(1, data.dropAddresses[0]?.address)}
                            >
                              {name?.address}
                            </Text>
                          </Block>
                        </Block>
                      </>
                    )}
                  </>
                  // </Pressable>
                ))}
          </Block>
        </Block>
        <Block row>
          <Block>
            <Text
              size={14}
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Delivery Time
            </Text>
          </Block>

          <Block flex right>
            <Text
              size={14}
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              {data.deliverytime}
            </Text>
          </Block>
        </Block>
        <Block row>
          <Block>
            <Text
              size={14}
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Price Details
            </Text>
          </Block>

          <Block flex right>
            <Text
              size={14}
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              ${data.jobPrice} / {data.priceType} / {data.truck} /{" "}
              {data.paymentMethod}
            </Text>
          </Block>
        </Block>
        <Block
          row
          style={data.paymentMethod == "INV" ? styles.hidediv : styles.showdiv}
        >
          <Block>
            <Text
              size={14}
              style={styles.ListTitleLeft}
              color={theme.COLORS.SECONDARY}
            >
              Fuel Charges
            </Text>
          </Block>

          <Block flex right>
            <Text
              size={14}
              style={styles.ListTitleRight}
              color={theme.COLORS.SECONDARY}
            >
              $ {data.fuel_surcharge}
            </Text>
          </Block>
        </Block>

        {data.advanceAmt > 0 ? (
          <Block
            row
            style={data.paymentMethod == "INV" ? styles.hidediv : styles.showdiv}
          >
            <Block>
              <Text
                size={14}
                style={styles.ListTitleLeft}
                color={theme.COLORS.SECONDARY}
              >
                Advance Booking Amount
              </Text>
            </Block>

            <Block flex right>
              <Text
                size={14}
                style={styles.ListTitleRight}
                color={theme.COLORS.SECONDARY}
              >
                $ {data.advanceAmt}
              </Text>
            </Block>
          </Block>
        ) : null}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderWidth: 0.1,
    // shadowColor: "#8898AA",
    // shadowOffset: { width: 1, height: 1 },
    // shadowRadius: 50,
    // shadowOpacity: 0.9,
    // elevation: 200,
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  hidediv: {
    display: "none",
  },
  showdiv: {
    display: "flex",
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

  cardTitle: {
    height: 20,
    paddingLeft: 10,
    textTransform: "uppercase",
  },

  iconstwo: {
    paddingTop: 5,
    color: "#848484",
    paddingRight: 5,
  },
  pickupAddress: {
    padding: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
  },
});

export default Jobdetail;
