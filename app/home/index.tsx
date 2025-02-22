import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Platform,
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface Action {
  icon: 'file-document-edit' | 'palette' | 'account-edit';
  title: string;
  description: string;
  gradient: [string, string];
  route: string;
}

const { width, height } = Dimensions.get('window');

export default function AIResumeHome() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const actions: Action[] = [
    { 
      icon: 'file-document-edit',
      title: 'Create Resume',
      description: 'Start from scratch',
      gradient: ['#4C6EF5', '#3B5BDB'],
      route: '/chat'
    },
    { 
      icon: 'palette',
      title: 'Select Template',
      description: 'Choose your design',
      gradient: ['#339AF0', '#228BE6'],
      route: '/templates'
    },
    { 
      icon: 'account-edit',
      title: 'User Details',
      description: 'Update your info',
      gradient: ['#22B8CF', '#15AABF'],
      route: '/resumes'
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <LinearGradient
            colors={['#040B2C', '#0A1959', '#040B2C']}
            style={styles.gradient}
          >
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.headerGradient}
              >
                <Animated.View 
                  style={[
                    styles.header, 
                    { 
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }]
                    }
                  ]}
                >
                  <Text style={styles.title}>AI Resume Creator</Text>
                  <Text style={styles.subtitle}>Craft Your Perfect Resume</Text>
                </Animated.View>
              </LinearGradient>
            </View>

            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.actionCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ 
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1]
                        })
                      }],
                      marginTop: index * 8
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.actionButton}
                    activeOpacity={0.9}
                    onPress={() => router.push(action.route)}
                  >
                    <LinearGradient
                      colors={action.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.actionGradient}
                    >
                      <View style={styles.iconContainer}>
                        <MaterialCommunityIcons 
                          name={action.icon} 
                          size={32} 
                          color="white" 
                        />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>{action.title}</Text>
                        <Text style={styles.actionDescription}>
                          {action.description}
                        </Text>
                      </View>
                      <View style={styles.arrowContainer}>
                        <MaterialCommunityIcons 
                          name="chevron-right" 
                          size={24} 
                          color="white" 
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.featuresContainer}>
              <Animated.View
                style={[
                  styles.featureCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ 
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.featureIconContainer}>
                  <MaterialCommunityIcons 
                    name="robot" 
                    size={32} 
                    color="#4C6EF5" 
                  />
                </View>
                <Text style={styles.featureTitle}>AI-Powered Writing</Text>
                <Text style={styles.featureDescription}>
                  Our advanced AI helps you write compelling content that highlights your strengths
                </Text>
              </Animated.View>
            </View>
          </LinearGradient>
        </ScrollView>

        <TouchableOpacity 
          style={styles.chatButton}
          activeOpacity={0.9}
          onPress={() => router.push('/chat')}
        >
          <LinearGradient
            colors={['#4C6EF5', '#3B5BDB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chatGradient}
          >
            <MaterialCommunityIcons 
              name="chat-processing" 
              size={24} 
              color="white" 
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsButton}
          activeOpacity={0.9}
          onPress={() => router.push('/settings')}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.1)']}
            style={styles.settingsGradient}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#040B2C',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    minHeight: height,
    paddingBottom: 100,
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 20 : 40,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(76, 110, 245, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#88ccff',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
    marginTop: 16,
  },
  actionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4C6EF5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  actionButton: {
    width: '100%',
    height: 90,
  },
  actionGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  actionDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    marginTop: 4,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresContainer: {
    padding: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 110, 245, 0.2)',
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(76, 110, 245, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#88ccff',
    lineHeight: 24,
  },
  chatButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4C6EF5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  chatGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  settingsGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});