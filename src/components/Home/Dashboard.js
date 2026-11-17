import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Block,
} from 'react-native';
const axios = require('axios');

//class Dashboard extends React.Component {
const Dashboard = () => {
  const url = 'https://app.movemystuff.com.au';
  const [chatlist, setChatList] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(url + '/chat/chat-list/15/3/2/15')
  //     .then(response => {
  //       console.log(response);
  //       setChatList(response.data.chats);
  //     })
  //     .catch(error => {
  //       console.log('API error', error);
  //     });
  // }, []);

  return (
    <Block flex center>
      {/* <Text
        muted
        center
        style={{
          color: '#ff0000',
        }}>
        Invalid Credential
      </Text> */}
    </Block>
  );
};

export default Dashboard;
