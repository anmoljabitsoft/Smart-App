//import moment from 'moment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getLocalStorage = (key) => {
  return AsyncStorage.getItem(key);
};

export const setLocalStorage = (key, value) => {
  AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key) => {
  return AsyncStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  AsyncStorage.clear();
};

export const workingDays = [
  { id: 1, label: "Monday", name: "workingDays.monday", value: 1 },
  {
    id: 2,
    label: "Tuesday",
    name: "workingDays.tuesday",
    value: 1,
  },
  {
    id: 3,
    label: "Wednesday",
    name: "workingDays.wednesday",
    value: 1,
  },
  {
    id: 4,
    label: "Thursday",
    name: "workingDays.thursday",
    value: 1,
  },
  { id: 5, label: "Friday", name: "workingDays.friday", value: 1 },
  {
    id: 6,
    label: "Saturday",
    name: "workingDays.saturday",
    value: 0,
  },
  { id: 7, label: "Sunday", name: "workingDays.sunday", value: 1 },
];

export const STORAGE_KEY = "@dealerId";
export const STORAGE_LEADID = "@leadId";
export const STORAGE_CLIENTID = "@clientid";
export const STORAGE_CLIENTNAME = "@clientname";
export const STORAGE_INTRO = "@intro";
export const STORAGE_LAT = "@lat";
export const STORAGE_LANG = "@lang";
export const STORAGE_PATH = "@path";

export const STORAGE_DRIVERID = "@driverId";
export const STORAGE_PERSONID = "@personId";

export const STORAGE_ROLEID = "@roleId";
export const STORAGE_JOBID = "@jobId";
export const STORAGE_SUM = "@total";
export const STORAGE_VIEW = "@details";
export const STORAGE_NAME = "@name";
export const STORAGE_SIGN = "@sign";
export const STORAGE_SIGNATURE = "@signature";
export const STORAGE_ISSUEID = "@issueid";
export const STORAGE_PERSONNAME = "@personname";
export const STORAGE_USEREMAIL = "@useremail";
export const STORAGE_TOKEN = "@token";
export const STORAGE_REDIRECTIONATJOBLISTPAGE = "@value";

const IP_ADDRESS= "192.168.110.10" // Office
//  const IP_ADDRESS="192.168.1.5" // Home

 // =========================== Test Endpoints : ================================
// export const URL = "https://mms-node-tst.jsuite.in/api/Jobs/";
// export const URLEMAIL = "https://mms-node-tst.jsuite.in/api/Email/";
// export const URLDRIVER = "https://mms-node-tst.jsuite.in/api/Driver/";
// export const URLMSG = "https://mms-node-tst.jsuite.in/api/Msg/";
// export const URLSMS = "https://mms-node-tst.jsuite.in/api/Sms/";
// export const URLPAYMENT = "https://mms-node-tst.jsuite.in/api/Payment/";
// export const WAIVERFROM = "https://mms-node-tst.jsuite.in/api/Email/";
// export const CUSTOMERIMAGEFROM = "https://mms-node-tst.jsuite.in/api/Driver/";


// =========================== Live Endpoints : ================================
export const URLEMAIL = "https://mms-node-live.jsuite.in/api/Email/";
export const URLDRIVER = "https://mms-node-live.jsuite.in/api/Driver/";
export const URLMSG = "https://mms-node-live.jsuite.in/api/Msg/";
export const URL = "https://mms-node-live.jsuite.in/api/Jobs/";
export const URLSMS = "https://mms-node-live.jsuite.in/api/Sms/";
export const URLPAYMENT = "https://mms-node-live.jsuite.in/api/Payment/";
export const WAIVERFROM = "https://mms-node-live.jsuite.in/api/Email/";
export const CUSTOMERIMAGEFROM = "https://mms-node-live.jsuite.in/api/Driver/"; 

//================ Local System  Endpoints : IP Address Based ================
// export const URL = `http://${IP_ADDRESS}:7001/api/Jobs/`;
// export const URLDRIVER = `http://${IP_ADDRESS}:7001/api/Driver/`;
// export const URLEMAIL = `http://${IP_ADDRESS}:7001/api/Email/`;
// export const URLMSG = `http://${IP_ADDRESS}:7001/api/Msg/`;
// export const URLSMS = `http://${IP_ADDRESS}:7001/api/Sms/`;
// export const URLPAYMENT = `http://${IP_ADDRESS}:7001/api/Payment/`;
// export const WAIVERFROM = `http://${IP_ADDRESS}:7001/api/Email/`;
//  export const CUSTOMERIMAGEFROM = `http://${IP_ADDRESS}:7001/api/Driver/`;
