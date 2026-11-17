import React, { Component, useEffect } from "react";
import {
    PermissionsAndroid,
    Platform,
} from "react-native";
import GetLocation from 'react-native-get-location';
// import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { STORAGE_DRIVERID, URLDRIVER } from "./src/utils/factory";


export default function GeoLocations({ navigation }) {

    // Handle Update Geo Location
    const handleUpdateGeoLocation = async (loc) => {
        console.log("######################################211111111111111111111111", loc)

        const driverid = await AsyncStorage.getItem(STORAGE_DRIVERID);

        const json = {
            DriverId: driverid,
            Longitude: JSON.stringify(loc.longitude),
            Latitude: JSON.stringify(loc.latitude)
        };

        console.log("*******************************************", json)
        try {
            axios
                .post(URLDRIVER + "UpdateGeoLocation", json, {
                    headers: {
                        Authorization:
                            "YWRtaW5AbW92ZW15c3R1ZmYuY29tLmF1Om1tc2FkbWluMjM0NTYm",
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log("Response Location:::::",response.data);
                })
                .catch((error) => {
                    console.log("API error of my lead", error);
                })
                .finally(function () {

                });
        } catch (error) {
            console.log("API error of my lead", error);
        }
    };


    const data = async () => {
        let hasPermission = true
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )

            if (!hasPermission) {
                const status = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )
                hasPermission = status === PermissionsAndroid.RESULTS.GRANTED

                // the patch:
                if (hasPermission == false) {
                    alert("Please open location")

                }
            }

            if (hasPermission == true) {
                const interval = setInterval(() => {
                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 60000,
                    }).then((location) => {

                        handleUpdateGeoLocation(location);

                    }).catch(error => {
                        const { code, message } = error;
                        console.log("Inside Error Location", code, message);
                    });
                }, 10000);

                return () => clearInterval(interval);
            }
        }
        if (hasPermission) {
            // RCTLocationObserver.getCurrentPosition(geo_options || {}, geo_success, geo_error || logError)
            console.log("######################################4");

        }
    }


    useEffect(() => {
        data();
    }, []);

    return null;
}
