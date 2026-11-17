import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const InternetCheck = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'No Internet Connection',
          text2: 'Please check your network.',
          visibilityTime: 3000, // time the alert is visible
          autoHide: true, // hides after the set time
        });
      } else {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'You are back online!',
          text2: 'Everything’s working fine now.',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return null; // nothing to render
};

export default InternetCheck;
