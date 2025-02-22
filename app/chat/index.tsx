import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Platform,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatScreen from './ChatScreen';
import FormScreen from './FormScreen.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  useSharedValue 
} from 'react-native-reanimated';
import { sendChatMessage } from '../../api/chat';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function ChatLayout() {
  const router = useRouter();
  const { templateId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'chat' | 'form'>('chat');
  const [showProfessionModal, setShowProfessionModal] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formSpec, setFormSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [professionInput, setProfessionInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const { width } = useWindowDimensions();
  const PADDING = 24;
  const TAB_WIDTH = (width - (PADDING * 2)) / 2;
  
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (!templateId) {
      router.replace('/templates');
    }
  }, [templateId]);

  const handleTabChange = (tab: 'chat' | 'form') => {
    setActiveTab(tab);
    translateX.value = withSpring(tab === 'chat' ? 0 : TAB_WIDTH, {
      damping: 15,
      stiffness: 100,
    });
  };

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleProfessionSubmit = async () => {
    if (!professionInput.trim()) {
      Alert.alert('Error', 'Please enter your profession');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await sendChatMessage({
        message: professionInput,
        isChat: true,
        templateId: templateId as string
      });
      
      if (response.success) {
        setSessionId(response.result.sessionId);
        if (response.result.formJSONSpec) {
          setFormSpec(response.result.formJSONSpec);
        }
        // Add initial message to chat
        setChatMessages([{
          id: Date.now().toString(),
          text: `Hi! I understand you're a ${professionInput}. I'll help you create a professional resume. You can either chat with me about your experience or use the form to input your details directly.`,
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
      setShowProfessionModal(false);
    }
  };

  const handleRestart = React.useCallback(() => {
    setShowProfessionModal(true);
    setSessionId(null);
    setFormSpec(null);
    setProfessionInput('');
    setChatMessages([]);
    setActiveTab('chat');
    // Reset but stay on the same page with same template
    router.replace({
      pathname: '/chat',
      params: { templateId }
    });
  }, [router, templateId]);

  if (!templateId) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0f1729]">
      <Modal
        visible={showProfessionModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-[#1a2642] rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-white text-xl font-semibold mb-4">Enter Your Profession</Text>
            {isLoading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#60a5fa" />
                <Text className="text-blue-400 mt-4">Initializing...</Text>
              </View>
            ) : (
              <View>
                <TextInput
                  className="px-4 py-3 text-white bg-white/5 rounded-xl border border-blue-500/20 mb-4"
                  placeholder="e.g. Software Engineer, UX Designer..."
                  placeholderTextColor="#94a3b8"
                  value={professionInput}
                  onChangeText={setProfessionInput}
                  onSubmitEditing={handleProfessionSubmit}
                />
                <TouchableOpacity
                  onPress={handleProfessionSubmit}
                  className="bg-blue-500 p-4 rounded-xl active:opacity-80"
                >
                  <Text className="text-white text-lg text-center">Continue</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View className="px-6 py-4">
        <View className="overflow-hidden">
          <View 
            className="rounded-2xl border border-blue-500/20 bg-white/5"
            style={{
              ...Platform.select({
                web: {
                  boxShadow: '0 4px 12px rgba(96,165,250,0.2)',
                },
                ios: {
                  shadowColor: '#60a5fa',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 8,
                },
              }),
            }}
          >
            <View className="flex-row relative h-14">
              <Animated.View 
                className="absolute h-full px-1 py-1"
                style={[
                  { width: TAB_WIDTH },
                  sliderStyle
                ]}
              >
                <View 
                  className="h-full w-full rounded-xl bg-blue-500/20"
                  style={{
                    ...Platform.select({
                      web: {
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      },
                    }),
                  }}
                />
              </Animated.View>
              
              {['chat', 'form'].map((tab) => (
                <TouchableOpacity 
                  key={tab}
                  onPress={() => handleTabChange(tab as 'chat' | 'form')}
                  style={{ width: TAB_WIDTH }}
                  className="justify-center items-center flex-row space-x-2 z-10"
                >
                  <MaterialCommunityIcons 
                    name={tab === 'chat' ? 'chat-processing' : 'form-select'} 
                    size={22} 
                    color={activeTab === tab ? '#60a5fa' : '#94a3b8'} 
                  />
                  <Text className={`font-medium text-base ${
                    activeTab === tab ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1">
        {activeTab === 'chat' ? (
          <ChatScreen 
            sessionId={sessionId} 
            messages={chatMessages}
            onMessagesChange={setChatMessages}
            onRestart={handleRestart}
          />
        ) : (
          <FormScreen 
            sessionId={sessionId} 
            formSpec={formSpec} 
            onChatUpdate={setChatMessages}
            onRestart={handleRestart}
          />
        )}
      </View>
    </SafeAreaView>
  );
}