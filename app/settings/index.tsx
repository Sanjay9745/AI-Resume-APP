import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  SafeAreaView,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeIn,
  SlideInDown,
  SlideInLeft 
} from 'react-native-reanimated';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'account-circle',
          title: 'Profile Settings',
          description: 'Manage your personal information',
          chevron: true
        },
        {
          icon: 'bell-ring',
          title: 'Notifications',
          description: 'Control your notification preferences',
          toggle: true,
          value: notifications,
          onToggle: setNotifications
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'theme-light-dark',
          title: 'Dark Mode',
          description: 'Toggle dark/light theme',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode
        },
        {
          icon: 'content-save',
          title: 'Auto Save',
          description: 'Automatically save resume progress',
          toggle: true,
          value: autoSave,
          onToggle: setAutoSave
        },
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          title: 'Help Center',
          description: 'Get help with using the app',
          chevron: true
        },
        {
          icon: 'star',
          title: 'Rate App',
          description: 'Rate us on the app store',
          chevron: true
        },
        {
          icon: 'shield-check',
          title: 'Privacy Policy',
          description: 'Read our privacy policy',
          chevron: true
        },
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#040B2C]">
      <LinearGradient
        colors={['#040B2C', '#0A1959', '#040B2C']}
        className="absolute inset-0"
      />

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="min-h-screen pb-8">
          {/* Header */}
          <Animated.View
            entering={SlideInDown.duration(1000)}
            className="px-6 py-8 items-center"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute left-4 top-4 w-10 h-10 rounded-full border border-white/20 items-center justify-center bg-white/10"
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white text-center">
              Settings
            </Text>
            <Text className="text-[#88ccff] text-lg mt-2">
              Customize your experience
            </Text>
          </Animated.View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} className="px-4 py-2">
              <Animated.Text
                entering={SlideInLeft.delay(sectionIndex * 100)}
                className="text-[#88ccff] text-lg font-semibold mb-4 ml-2"
              >
                {section.title}
              </Animated.Text>
              {section.items.map((item, index) => (
                <Animated.View
                  key={index}
                  entering={FadeIn.delay((index + 1) * 200)}
                  className="mb-4"
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-blue-500/20"
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                      className="flex-row items-center p-4"
                    >
                      <MaterialCommunityIcons 
                        name={item.icon} 
                        size={24} 
                        color="#88ccff" 
                      />
                      <View className="flex-1 ml-4">
                        <Text className="text-white text-lg font-semibold">
                          {item.title}
                        </Text>
                        <Text className="text-white/70 text-sm mt-1">
                          {item.description}
                        </Text>
                      </View>
                      {item.toggle ? (
                        <Switch
                          value={item.value}
                          onValueChange={item.onToggle}
                          trackColor={{ false: '#1a1a1a', true: '#357abd' }}
                          thumbColor={item.value ? '#4a90e2' : '#f4f3f4'}
                          ios_backgroundColor="#1a1a1a"
                        />
                      ) : item.chevron ? (
                        <MaterialCommunityIcons 
                          name="chevron-right" 
                          size={24} 
                          color="#88ccff" 
                        />
                      ) : null}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          ))}

          {/* Logout Button */}
          <Animated.View
            entering={FadeIn.delay(800)}
            className="px-6 mt-4"
          >
            <TouchableOpacity
              className="rounded-xl overflow-hidden shadow-lg shadow-blue-500/30"
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4a90e2', '#357abd']}
                className="flex-row items-center justify-center py-4 space-x-2"
              >
                <MaterialCommunityIcons name="logout" size={24} color="white" />
                <Text className="text-white text-lg font-semibold">
                  Log Out
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}