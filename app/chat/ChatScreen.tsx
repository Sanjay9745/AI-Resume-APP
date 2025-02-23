import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { sendChatMessage } from '../../api/chat';
import cdnUrl from '../../api/cdnUrl';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isJson?: boolean;
  jsonPath?: string;
  resumePath?: string;
}

interface ChatScreenProps {
  sessionId: string | null;
  messages: Message[];
  onMessagesChange: (updater: (messages: Message[]) => Message[]) => void;
  onRestart: () => void;
}

export default function ChatScreen({ sessionId, messages, onMessagesChange, onRestart }: ChatScreenProps) {
  const { templateId } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleDownload = async (path: string) => {
    try {
      const url = `${cdnUrl}${path}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to existing messages using the callback form
    onMessagesChange(prevMessages => [...prevMessages, newMessage]);
    
    setInputText('');
    setTimeout(() => scrollToBottom(), 100);
    handleChatResponse(inputText);
  };

  const handleChatResponse = async (message: string) => {
    if (!sessionId || !templateId) return;
    
    setIsTyping(true);
    try {
      const response = await sendChatMessage({
        message,
        sessionId,
        isChat: true,
        templateId: templateId as string
      });
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: response.result.chatMessage || '',
        isUser: false,
        timestamp: new Date(),
        isJson: response.result.formJSONSpec !== undefined,
        jsonPath: response.result.path,
        resumePath: response.result.resumePath
      };
      
      // Add only the AI response message to existing messages
      onMessagesChange(prevMessages => [...prevMessages, newMessage]);
      
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your message. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      // Update messages while preserving previous messages
      onMessagesChange(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <View
      className={`flex-row ${
        message.isUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      {!message.isUser && (
        <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center mr-2">
          <FontAwesome5 name="robot" size={16} color="#60a5fa" />
        </View>
      )}
      <View className={`max-w-[75%] ${message.isUser ? 'items-end' : 'items-start'}`}>
        <LinearGradient
          colors={message.isUser 
            ? ['#60a5fa', '#3b82f6'] 
            : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={{ borderRadius: 10 }}
          className={`p-4 ${
            message.isUser ? 'rounded-tr-none' : 'rounded-tl-none'
          }`}
        >
          {message.isJson && message.text.includes('JSON_FORMAT_READY') ? (
            <View className="items-center">
              <Text className="text-base text-gray-100 mb-3">
                Your resume is ready!
              </Text>
              <TouchableOpacity
                style={{ overflow: 'hidden' }}
                onPress={() => message.resumePath && handleDownload(message.resumePath)}
                className="bg-blue-500/20 px-4 py-2 rounded-full flex-row items-center mb-3"
              >
                <MaterialIcons name="file-download" size={20} color="#60a5fa" />
                <Text className="text-blue-400 ml-2">Download Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ overflow: 'hidden' }}
                onPress={onRestart}
                className="bg-white/10 px-4 py-2 rounded-full flex-row items-center"
              >
                <Ionicons name="refresh" size={20} color="#60a5fa" />
                <Text className="text-blue-400 ml-2">Start New Chat</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className={`text-base ${message.isUser ? 'text-white' : 'text-gray-100'}`}>
              {message.text}
            </Text>
          )}
        </LinearGradient>
        <Text className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      {message.isUser && (
        <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center ml-2">
          <MaterialIcons name="person" size={16} color="#60a5fa" />
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-[#0f1729]">
      <LinearGradient
        colors={['rgba(96,165,250,0.1)', 'transparent']}
        className="px-4 py-3 flex-row items-center justify-between border-b border-blue-500/20"
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center">
            <FontAwesome5 name="robot" size={20} color="#60a5fa" />
          </View>
          <View className="ml-3">
            <Text className="text-white text-lg font-semibold">AI Assistant</Text>
            <Text className="text-blue-400 text-sm">Always Online</Text>
          </View>
        </View>    
    {/* <TouchableOpacity 
        style={{ overflow: 'hidden' }}
        onPress={() => router.push('/home')}
        className="w-10 h-10 rounded-full border border-blue-500/20 ml-2 items-center justify-center"
    >
        <LinearGradient
            colors={['rgba(96,165,250,0.1)', 'rgba(59,130,246,0.05)']}
            className="absolute inset-0 rounded-full"
        />
        <MaterialIcons name="home" size={20} color="#60a5fa" />
    </TouchableOpacity> */}
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        bounces={true}
        onContentSizeChange={() => {
          if (messages.length > 0 || isTyping) {
            scrollToBottom();
          }
        }}
      >
        <View className="py-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center mr-2">
                <FontAwesome5 name="robot" size={16} color="#60a5fa" />
              </View>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={{ borderRadius: 10 }}
                className="rounded-tl-none p-3"
              >
                <View className="flex-row space-x-2">
                  <View className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                  <View className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100" />
                  <View className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-200" />
                </View>
              </LinearGradient>
            </View>
          )}
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardHeight}
        className="border-t border-blue-500/20"
      >
        <View className="p-4 flex-row items-center space-x-4">
          <View className="flex-1 bg-white/5 rounded-2xl border border-blue-500/20">
            <TextInput
              className="px-4 py-3 text-white min-h-[44px]"
              placeholder="Type your message..."
              placeholderTextColor="#94a3b8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              onSubmitEditing={sendMessage}
            />
          </View>
          <TouchableOpacity 
          style={{ overflow: 'hidden' }}
            onPress={sendMessage}
            className="active:opacity-80"
          >
            <LinearGradient
              colors={['#60a5fa', '#3b82f6']}
              style={{ borderRadius: 10 , marginLeft: 10}}
              className="w-12 h-12 items-center justify-center shadow-lg shadow-blue-500/50"
            >
              <MaterialIcons name="send" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}