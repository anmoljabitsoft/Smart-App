import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const formatTime = (ms) => {
  const milliseconds = Math.floor((ms % 1000) / 10);
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;
//   return `${String(minutes).padStart(2, '0')}:${String(
//     seconds
//   ).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
};

const Stopwatch = ({
  start = false,
  reset = false,
  options = {},
  startTime = 0,
}) => {
  const [time, setTime] = useState(startTime);
  const intervalRef = useRef(null);
  const prevStartRef = useRef(start);
  const prevResetRef = useRef(reset);

  useEffect(() => {
    if (start && !prevStartRef.current) {
      const startPoint = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startPoint);
      }, 10);
    }

    if (!start && prevStartRef.current) {
      clearInterval(intervalRef.current);
    }

    prevStartRef.current = start;
  }, [start]);

  useEffect(() => {
    if (reset && !prevResetRef.current) {
      clearInterval(intervalRef.current);
      setTime(startTime);
    }
    prevResetRef.current = reset;
  }, [reset, startTime]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Text style={styles.defaultText}>{formatTime(time)}</Text>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    color:'#fff'
  },
  defaultText: {
    fontWeight:'600',
    fontSize: 13,
    color: '#fff',
  },
});

export default Stopwatch;
