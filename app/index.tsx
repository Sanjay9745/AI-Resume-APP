import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const SLIDER_WIDTH = width * 0.85;
const KNOB_SIZE = 64;

// Check if platform is web
const isWeb = Platform.OS === 'web';

const ParticleEffect = ({ style }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export default function HomeScreen() {
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Redirect to templates page immediately if on web
  useEffect(() => {
    if (isWeb) {
      router.replace('/templates');
    }
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  // If we're on web, don't render the mobile UI
  if (isWeb) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.loadingText}>Redirecting to templates...</Text>
      </View>
    );
  }

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleGestureUpdate = (event: any) => {
    const dragX = event.nativeEvent.translationX;
    // If the user has dragged past 70% of the slider width while still holding
    if (dragX > SLIDER_WIDTH * 0.7) {
      // Navigate to templates immediately
      router.replace('/templates');
    }
  };

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: false,
      listener: handleGestureUpdate // Add listener to check position during drag
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 5) {
      const dragX = event.nativeEvent.translationX;
      if (dragX > SLIDER_WIDTH * 0.7) {
        Animated.timing(translateX, {
          toValue: SLIDER_WIDTH - KNOB_SIZE,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          router.replace('/templates');
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const sliderPosition = translateX.interpolate({
    inputRange: [0, SLIDER_WIDTH - KNOB_SIZE],
    outputRange: [0, SLIDER_WIDTH - KNOB_SIZE],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#0f1729', '#1a237e', '#0f1729']} style={styles.container}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <ParticleEffect style={[styles.particle, { left: '10%' }]} />
            <ParticleEffect style={[styles.particle, { left: '30%' }]} />
            <ParticleEffect style={[styles.particle, { left: '50%' }]} />
            <ParticleEffect style={[styles.particle, { left: '70%' }]} />
            <ParticleEffect style={[styles.particle, { left: '90%' }]} />

            <Animated.View
              style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
              ]}
            >
              <View style={styles.headerContainer}>
                <LinearGradient
                  colors={['rgba(96, 165, 250, 0.2)', 'rgba(59, 130, 246, 0.1)']}
                  style={styles.iconBackground}
                >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <FontAwesome5 name="robot" size={40} color="#60a5fa" />
                  </Animated.View>
                </LinearGradient>
                <Text style={styles.title}>Your AI</Text>
                <Text style={styles.subtitle}>Resume Builder</Text>
              </View>

              <View style={styles.imageContainer}>
                <LinearGradient
                  colors={['rgba(96, 165, 250, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                  style={styles.imageWrapper}
                >
                  <View style={styles.imageBorder}>
                    <View style={styles.image}>
                      <View style={styles.resumeIcon}>
                        <View style={styles.resumeLine} />
                        <View style={styles.resumeLine} />
                        <View style={styles.resumeLine} />
                        <View style={styles.resumeCircle}>
                          <MaterialIcons name="person" size={24} color="#60a5fa" />
                        </View>
                        <LinearGradient
                          colors={['rgba(96, 165, 250, 0.2)', 'rgba(59, 130, 246, 0.1)']}
                          style={styles.resumeGlow}
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  Create professional resumes with AI-powered suggestions
                </Text>
                <Text style={styles.subDescription}>
                  Let AI guide you to your dream job
                </Text>
              </View>

              <View style={styles.sliderContainer}>
                <LinearGradient
                  colors={['rgba(96, 165, 250, 0.15)', 'rgba(59, 130, 246, 0.1)']}
                  style={styles.sliderTrack}
                >
                  <Text style={styles.sliderText}>SWIPE TO BEGIN</Text>
                  <PanGestureHandler
                    onGestureEvent={handleGesture}
                    onHandlerStateChange={onHandlerStateChange}
                  >
                    <Animated.View
                      style={[
                        styles.knob,
                        { transform: [{ translateX: sliderPosition }] }
                      ]}
                    >
                      <LinearGradient
                        colors={['#60a5fa', '#3b82f6']}
                        style={styles.knobGradient}
                      >
                        <MaterialIcons name="arrow-forward" size={32} color="#fff" />
                      </LinearGradient>
                    </Animated.View>
                  </PanGestureHandler>
                </LinearGradient>
              </View>

              {/* <TouchableOpacity style={styles.helpButton}>
                <LinearGradient
                  colors={['rgba(96, 165, 250, 0.2)', 'rgba(59, 130, 246, 0.1)']}
                  style={styles.helpGradient}
                >
                  <Text style={styles.helpText}>Need Help?</Text>
                </LinearGradient>
              </TouchableOpacity> */}
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f1729',
  },
  container: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#60a5fa',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(96, 165, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 32,
    color: '#60a5fa',
    fontWeight: '600',
    textShadowColor: 'rgba(96, 165, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  imageContainer: {
    marginVertical: 20,
  },
  imageWrapper: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  imageBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    padding: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  resumeIcon: {
    width: 150,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 15,
    padding: 15,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resumeLine: {
    height: 8,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 4,
    marginBottom: 10,
    width: '100%',
  },
  resumeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  resumeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  descriptionContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  description: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subDescription: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    alignItems: 'center', marginBottom: 20,
  },
  sliderTrack: {
    width: '100%',
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  sliderText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  knob: {
    position: 'absolute',
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
  },
  knobGradient: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  helpGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  helpText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1729',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#60a5fa',
  },
});