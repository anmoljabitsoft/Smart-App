
import React from 'react';
import {
  Switch,
  Text,
  View,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  Subscription
} from "react-native-background-geolocation";

import axios from "axios";
// import AsyncStorage from "@react-native-community/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_DRIVERID, URLDRIVER } from "./src/utils/factory";



const NewGeolocation = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');

  React.useEffect(() => {
  try {
    
  //console.log('[onLocation]222');
    /// 1.  Subscribe to events.

//const subscription = BackgroundGeolocation.onLocation((location) => {
//  console.log("[onLocation] success: ", location);
//}, (error) => {
//  console.log("[onLocation] ERROR: ", error);
//});


//    const subscription = BackgroundGeolocation.onMotionChange((event) => {
//      if (event.isMoving) {
//         console.log("[onMotionChange] Device has just started MOVING ", event.location);
//      } else {
//         console.log("[onMotionChange] Device has just STOPPED:  ", event.location);
//      }
//    });



    const onLocation:Subscription = BackgroundGeolocation.onLocation((location) => {
    //  console.log('[onLocation]', location.coords.latitude);
      setLocation(JSON.stringify(location, null, 2));
   //   alert(JSON.stringify(location));
      if(JSON.stringify(location) != '{"error":1}')
      {
  // alert("ddd");
      readData(location.coords.latitude, location.coords.longitude);
      }
//      else
//      {
//       alert("11111");
//      }
    })

//    const onMotionChange:Subscription = BackgroundGeolocation.onMotionChange((event) => {
//      console.log('[onMotionChange]', event.location.coords.latitude, event.location.coords.longitude);
//
//     //readData(event.location.coords.latitude, event.location.coords.longitude);
//
//
//    });

//    const onActivityChange:Subscription = BackgroundGeolocation.onActivityChange((event) => {
//      console.log('[onActivityChange]', event);
//
////        const location =  BackgroundGeolocation.getCurrentPosition({
////              samples: 2,
////              extras: {
////                event: 'background-fetch',
////                headless: true
////              }
////            });
////             console.log('[BackgroundFetch] getCurrentPosition: ', location);
//          const onLocation:Subscription = BackgroundGeolocation.onLocation((location) => {
//            console.log('[onLocation]', location.coords.latitude);
//            setLocation(JSON.stringify(location, null, 2));
//            readData(location.coords.latitude, location.coords.longitude);
//          })
//
//
//
////      readData("","");
////BackgroundGeolocation.stop();
//  //BackgroundGeolocation.start();
//    })

//    const onProviderChange:Subscription = BackgroundGeolocation.onProviderChange((event) => {
//      console.log('[onProviderChange]', event);
//    })
//console.log('hfsdfshfkhskjhfkhskfhskfhkshjkdfhkhskfhk');
    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "19ebf49b4c7adb7778f3c70dbaa7c66bbee8d179d6bcc031ef26cb9633f82f7f"
      }
    }).then((state) => {
      setEnabled(state.enabled)
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    });







    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
    //  onMotionChange.remove();
     // onActivityChange.remove();
//      onProviderChange.remove();
    }

    } catch (error) {

         }


  }, []);




          const readData = async (lat,long) => {

     console.log("######################################211111111111111111111111", lat)

//  BackgroundGeolocation.onMotionChange((event) =>  {
//        console.log('[onMotionChange]', event.location.coords.latitude, event.location.coords.longitude);
//
//       lat = event.location.coords.latitude;
//        long = event.location.coords.longitude;


//alert(lat);



              const driverid = await AsyncStorage.getItem(STORAGE_DRIVERIDE_DRIVERID);

              const json = {
                  DriverId: driverid,
                  Longitude: JSON.stringify(long),
                  Latitude: JSON.stringify(lat)
              };

              console.log("*******************************************", URLDRIVER, json)


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
                      console.log("*PPPPP*****************", response)
                      alert("a");

                      })
                      .catch((error) => {
                          console.log("API error of my lead", error);

                      })
                      .finally(function () {

                      });
              } catch (error) {
                  console.log("API error of my lead", error);
              }
//              });

          };

  /// 3. start / stop BackgroundGeolocation
  React.useEffect(() => {
    if (enabled) {
BackgroundGeolocation.start();
//                      const interval = setInterval(() => {
////                     let asb = BackgroundGeolocation.e;
////BackgroundGeolocation.stop();
// //                    BackgroundGeolocation.start();
//                          console.log("dfsdfsdfsdfsdfsfd");
//                      }, 10000);

    } else {
      BackgroundGeolocation.start();
    //  console.log("asdasdadsasd",BackgroundGeolocation.location());
      setLocation('');
    }
  }, [enabled]);


}

export default NewGeolocation;