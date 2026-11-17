import 'react-native-gesture-handler'; // 👈 always first
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQIPCore } from 'react-native-square-in-app-payments';
import Login from './src/components/Screens/Login';
import Dashboard from './src/components/Screens/Dashboard';
import Joblistpage from "./src/components/Screens/Joblistpage";
import Jobdetailpage from "./src/components/Screens/Jobdetailpage";
import WaiverFrom from "./src/components/Screens/WaiverForm";
import WaiverList from "./src/components/Screens/WaiverList";
import JobsIssuePage from "./src/components/Screens/JobIssuePageNew";
import CustomerImagePage from "./src/components/Screens/CustomerImagePage";
import Paymentpage from "./src/components/Screens/Paymentpage";
import MixPayment from "./src/components/Screens/MixPayment";
import PaymentCashPage from "./src/components/Screens/PaymentCashPage";
import OnlinePayment from "./src/components/Screens/OnlinePayment";

import InvoicePage from './src/components/Screens/InvoicePage';
import IssueListPage from './src/components/Screens/IssuesList';
import IssueViewDetails from './src/components/Screens/IssueViewDetails';
import AddCustomerImage from './src/components/Screens/AddCustomerImage';
import SendConfirmationPage from './src/components/Screens/SendConfirmationInvoice';
import SuccessScreen from './src/components/Screens/SuccessScreen';
import FinishJobDetail from "./src/components/Screens/FinishJobDetail";
import Profilepage from './src/components/Screens/Profilepage';
import UpdateTime from './src/components/Screens/UpdateTime';
import Intro from './src/components/Screens/Intro';


// import NewGeolocation from './newlocation';
// import GeoLocations from './newlocation
// import InternetCheck from './src/components/CheckInternet';
// import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import NewGeolocation from './newlocation';


const Stack = createNativeStackNavigator();

// // SandBox Application ID
// const SQUERE_APPLICATIONID="sandbox-sq0idb-f6x9CrQ-25SLSniIxMMxzA";
// Live Application
const SQUERE_APPLICATIONID="sq0idp-bYDfHPn4pdfNk0S0YsPHYg";
const initState = async () => {
  await SQIPCore.setSquareApplicationId(SQUERE_APPLICATIONID);
 
};
export default function App() {
useEffect(() => {
  initState();
},[]);


  return (
    <>
  
    {/* <SafeAreaWrapper> */}
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="IntroPage" 
         screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
       
        <Stack.Screen name="IntroPage" component={Intro} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="MyJobs" component={Joblistpage} />
        <Stack.Screen name="JobDetails" component={Jobdetailpage} />
        <Stack.Screen name="WaiverFrom" component={WaiverFrom} />
        <Stack.Screen name="WaiverList" component={WaiverList} />
        <Stack.Screen name="JobsIssuePage" component={JobsIssuePage} /> 
        <Stack.Screen name="IssueListPage" component={IssueListPage} /> 
        <Stack.Screen name="IssueViewDetail" component={IssueViewDetails} />          
        <Stack.Screen name="CustomerImage" component={CustomerImagePage} />      
        <Stack.Screen name="Paymentpage" component={Paymentpage} />
        <Stack.Screen name="MixPayment" component={MixPayment} />
        <Stack.Screen name="PaymentCashPage" component={PaymentCashPage} />
        <Stack.Screen name="OnlinePayment" component={OnlinePayment} />
        <Stack.Screen name="AddCustomerImage" component={AddCustomerImage} />
        <Stack.Screen name="SendCashConfirmation" component={SendConfirmationPage} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="MyJobListPage" component={Joblistpage} />
        <Stack.Screen name="Invoice" component={InvoicePage} />
        <Stack.Screen name="FinishJobDetail" component={FinishJobDetail} />
        <Stack.Screen name="Profilepage" component={Profilepage} />
        <Stack.Screen name="UpdateTime" component={UpdateTime} /> 
        
   
      </Stack.Navigator>
    </NavigationContainer> 
     <NewGeolocation />

{/*     <NewGeolocation />
    {/* <GeoLocations /> */}
    {/* <Toast  />  Setup toast */}
    {/* </SafeAreaWrapper> */}
    </>
  );
}
