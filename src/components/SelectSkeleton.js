import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SelectSkeleton = () => {
  const shimmerAnim = new Animated.Value(0);

  Animated.loop(
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    })
  ).start();

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100]
  });

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonSelectBox}>
        <Animated.View 
          style={[
            styles.shimmer,
            { transform: [{ translateX }] }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    marginVertical: 10,
  },
  skeletonSelectBox: {
    height: 48,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 50,
  },
});

export default SelectSkeleton;