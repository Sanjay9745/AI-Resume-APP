import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeIn,
  SlideInRight,
  FadeInDown 
} from 'react-native-reanimated';
import { getTemplates } from '../../api/templates';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Template {
  id: string;
  name: string;
  image: string;
  description: string;
  gradient: [string, string];
}

export default function TemplatesScreen() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing chat sessions and fetch templates
    checkExistingSessions();
  }, []);

  const checkExistingSessions = async () => {
    try {
      // Get templates first
      const data = await getTemplates();
      setTemplates(data);
      
      // Check if there's a currently active session
      for (const template of data) {
        const savedSession = await AsyncStorage.getItem(`session_${template.id}`);
        if (savedSession) {
          // Found an active session, redirect to chat
          router.replace({
            pathname: '/chat',
            params: { templateId: template.id }
          });
          return; // Exit early
        }
      }
    } catch (error) {
      console.error('Error checking templates or sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      router.replace({
        pathname: '/chat',
        params: { templateId: selectedTemplate }
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#040B2C] items-center justify-center">
        <ActivityIndicator size="large" color="#4C6EF5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#040B2C]">
      <LinearGradient
        colors={['#040B2C', '#0A1959', '#040B2C']}
        className="absolute inset-0"
      />

      <Animated.View 
        entering={FadeInDown.duration(1000)}
        className="flex-row items-center justify-between px-5 py-4"
      >
        <TouchableOpacity
          className="w-10 h-10 rounded-full border border-white/20 items-center justify-center bg-white/10"
          onPress={() => router.push('/')}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Templates</Text>
        <View className="w-10" />
      </Animated.View>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {templates.map((template, index) => (
            <Animated.View
              key={template.id}
              entering={SlideInRight.delay(index * 200)}
              className="w-[48%] mb-5"
            >
              <TouchableOpacity
                onPress={() => setSelectedTemplate(template.id)}
                className={`rounded-3xl overflow-hidden shadow-lg 
                  ${selectedTemplate === template.id
                    ? 'shadow-blue-500/50 scale-[1.02]' 
                    : 'shadow-blue-500/30'
                  }`}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={template.gradient}
                  className="p-3"
                >
                  <Image 
                    source={{ uri: template.image }}
                    className="w-full h-48 rounded-xl bg-white/10"
                    resizeMode="cover"
                  />
                  <Text className="text-white font-bold text-base mt-3 text-center">
                    {template.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedTemplate(template.id)}
                    className={`mt-2 py-2 px-4 rounded-xl 
                      ${selectedTemplate === template.id 
                        ? 'bg-white/30' 
                        : 'bg-white/20'
                      }`}
                  >
                    <Text className="text-white text-center font-semibold">
                      {selectedTemplate === template.id ? 'Selected' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                {selectedTemplate === template.id && (
                  <View className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {selectedTemplate && (
        <Animated.View 
          entering={FadeIn}
          className="absolute bottom-8 left-4 right-4"
        >
          <TouchableOpacity
            className="rounded-2xl overflow-hidden shadow-lg shadow-blue-500/50"
            onPress={handleUseTemplate}
          >
            <LinearGradient
              colors={['#4C6EF5', '#3B5BDB']}
              className="flex-row items-center justify-center py-4"
            >
              <Text className="text-white font-bold text-lg mr-2">
                Use Template
              </Text>
              <MaterialCommunityIcons 
                name="arrow-right" 
                size={24} 
                color="white" 
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}