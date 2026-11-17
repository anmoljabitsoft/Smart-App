import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'

const SafeAreaWrapper = ({children}) => {
  return (
   <SafeAreaView style={styles.SafeAreaContainer}>
    {children}
   </SafeAreaView>
  )
}

export default SafeAreaWrapper

const styles = StyleSheet.create({
    SafeAreaContainer:{
        flex:1
    }
})