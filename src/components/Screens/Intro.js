import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Platform,
  ActivityIndicator,
  Animated,
  TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text, theme } from "galio-framework";
import { STORAGE_INTRO } from "../../utils/factory";
import Swiper from 'react-native-swiper';
import materialTheme from "./Theme";
import SafeAreaWrapper from "../SafeAreaWrapper";

const { height, width } = Dimensions.get("window");

const Intro = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const checkIntroStatus = async () => {
    try {
      const introShown = await AsyncStorage.getItem(STORAGE_INTRO);
      if (introShown === "YES") {
        navigation.replace("Login");
      } else {
        setShowIntro(true);
      }
    } catch (error) {
      console.error("Error checking intro status:", error);
      setShowIntro(true);
    } finally {
      setIsChecking(false);
    }
  };

  const slides = [
    {
      id: 1,
      image: require("../../images/Splash-Screen-4.png"),
      title: "Welcome to Our App",
      description: "Discover amazing features that will make your life easier"
    },
    {
      id: 2,
      image: require("../../images/Splash-Screen-13.png"),
      title: "Easy to Use",
      description: "Intuitive interface designed for everyone"
    },
    {
      id: 3,
      image: require("../../images/Splash-Screen-14.png"),
      title: "Get Started",
      description: "Join thousands of satisfied users today"
    }
  ];

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleNext = () => {
    animateButton();
    if (currentIndex < slides.length - 1) {
      swiperRef.current?.scrollBy(1, true);
    }
  };

  const handleFinish = async () => {
    animateButton();
    try {
      await AsyncStorage.setItem(STORAGE_INTRO, "YES");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error saving intro status:", error);
    }
  };

  const renderPagination = (index, total) => {
    return (
      <View style={styles.pagination}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              index === i ? styles.paginationDotActive : null
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    checkIntroStatus();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);

  if (isChecking) {
    return (
      <Block flex center style={styles.container}>
        <ActivityIndicator size="large" color={materialTheme.COLORS.BUTTON} />
      </Block>
    );
  }

  if (!showIntro) {
    return null;
  }

  return (
    <SafeAreaWrapper>
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        onIndexChanged={(index) => setCurrentIndex(index)}
        activeDotColor={materialTheme.COLORS.BUTTON}
        dotColor={theme.COLORS.MUTED}
        scrollEnabled={true}
      >
        {slides.map((slide, index) => (

          <>
          <Image
              source={slide.image}
              style={styles.image}
              resizeMode="contain"
              
            />
           <Block flex key={slide.id} style={styles.slide}>
            
            
            <Block style={styles.content}>
              <Text h4 bold style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
              
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                {index === slides.length - 1 ? (
                  <Button
                    round
                    style={styles.button}
                    color={materialTheme.COLORS.BUTTON}
                    onPress={handleFinish}
                  >
                    <Text style={styles.buttonText}>Get Started</Text>
                  </Button>
                ) : (
                  <Button
                    round
                    style={styles.button}
                    color={materialTheme.COLORS.BUTTON}
                    onPress={handleNext}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </Button>
                )}
              </Animated.View>
            </Block>
            
            {renderPagination(index, slides.length)}
          </Block>
          </>
         
        ))}
      </Swiper>

      {currentIndex < slides.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE,
    flex: 1,
     width:"100%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center"
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
  },
  image: {
    width: width * 1,
    height: height * 0.7,
    marginTop:0,
    marginBottom:10,
    objectFit:"fill"
  },
  content: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: theme.SIZES.BASE * 2,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: materialTheme.COLORS.BUTTON,
    marginBottom: theme.SIZES.BASE,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: theme.COLORS.BLACK,
    textAlign: 'center',
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 3,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    width: width * 0.7,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginBottom: theme.SIZES.BASE * 2,
    marginTop:-20
  },
  buttonText: {
    fontFamily: 'montserrat-bold',
    fontSize: 16,
    color: theme.COLORS.WHITE,
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? height * 0.12 : height * 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: theme.COLORS.MUTED,
    display:"none"
  },
  paginationDotActive: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: materialTheme.COLORS.BUTTON,
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor:"#fff",
    borderRadius:50,
    width:80,
    
  },
  skipText: {
    color: materialTheme.COLORS.BUTTON,
    fontSize: 16,
    textAlign:'center',
    fontWeight: 'bold',
  },
});

export default Intro;