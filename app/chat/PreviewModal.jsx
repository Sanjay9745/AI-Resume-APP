import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, SafeAreaView, Linking, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import cdnUrl from '../../api/cdnUrl';
import { generateResumePDF } from '@/api/chat';

// Check if platform is web
const isWeb = Platform.OS === 'web';

// Simple HTML wrapper for preview
const createSimpleHtmlPreview = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      background-color: #f0f0f0;
      font-family: Arial, sans-serif;
      height: 100%;
      font-size: 14px;
    }

    @media screen and (max-width: 600px) {
      body {
        font-size: 12px;
      }
    }
    
    .page {
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin: 20px auto;
      width: 100%;
      max-width: 21cm;
      min-height: 29.7cm;
      padding: 0;
    }
    
    /* Mobile responsiveness */
    @media screen and (max-width: 600px) {
      .page {
        width: 95%;
        padding: 0;
      }
    }
    
    @media print {
      .page {
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
      body {
        background-color: white;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    ${content || '<p>No preview content available</p>'}
  </div>
</body>
</html>
`;

const PreviewModal = ({ visible, onClose, resumePath, htmlContent, sessionId, jsonData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeHtml, setResumeHtml] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (visible) {
      if (htmlContent) {
        setResumeHtml(createSimpleHtmlPreview(htmlContent));
        setIsLoading(false);
      } else if (resumePath) {
        fetchResumeHtml();
      } else {
        setResumeHtml(createSimpleHtmlPreview());
        setIsLoading(false);
      }
    }
  }, [visible, resumePath, htmlContent]);

  const fetchResumeHtml = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${cdnUrl}${resumePath}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resume content');
      }
      const html = await response.text();
      let bodyContent = html;
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        bodyContent = bodyMatch[1];
      }

      setResumeHtml(createSimpleHtmlPreview(bodyContent));
      setError(null);
    } catch (err) {
      console.error('Error fetching resume:', err);
      setError('Failed to load the resume preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsPdfGenerating(true);
    try {
      const response = await generateResumePDF(sessionId, jsonData);
      if (response.success && response.result) {
        const pdfUrl = `${cdnUrl}${response.result.resumePath}`;
        await Linking.openURL(pdfUrl);
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // For web platform, we'll render an iframe instead of WebView
  const renderWebContent = () => {
    if (isLoading || isPdfGenerating) {
      return (
        <View className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f1729]">
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text className="text-blue-400 mt-4">
            {isPdfGenerating ? 'Generating PDF...' : 'Loading preview...'}
          </Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-400 text-center text-lg">{error}</Text>
          <TouchableOpacity 
            onPress={onClose}
            className="bg-blue-500/20 px-4 py-2 rounded-full flex-row items-center mt-4"
          >
            <Ionicons name="arrow-back" size={20} color="#60a5fa" />
            <Text className="text-blue-400 ml-2">Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Use iframe for web
    return (
      <div 
        style={{ 
          flex: 1, 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#f0f0f0' 
        }}
      >
        <iframe
          srcDoc={resumeHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Resume Preview"
        />
      </div>
    );
  };

  // For native platforms, use WebView
  const renderNativeContent = () => {
    if (isLoading || isPdfGenerating) {
      return (
        <View className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f1729]">
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text className="text-blue-400 mt-4">
            {isPdfGenerating ? 'Generating PDF...' : 'Loading preview...'}
          </Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-400 text-center text-lg">{error}</Text>
          <TouchableOpacity 
            onPress={onClose}
            className="bg-blue-500/20 px-4 py-2 rounded-full flex-row items-center mt-4"
          >
            <Ionicons name="arrow-back" size={20} color="#60a5fa" />
            <Text className="text-blue-400 ml-2">Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: resumeHtml }}
        style={{ flex: 1, backgroundColor: '#f0f0f0' }}
        javaScriptEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setError(`WebView error: ${nativeEvent.description}`);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
          console.log('WebView loaded');
        }}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView className="flex-1 bg-[#0f1729]">
        <LinearGradient
          colors={['rgba(96,165,250,0.1)', 'transparent']}
          className="px-4 py-3 flex-row items-center justify-between border-b border-blue-500/20"
        >
          <Text className="text-white text-xl font-semibold">Resume Preview</Text>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={handleDownloadPdf}
              disabled={isPdfGenerating}
              className="w-10 h-10 rounded-full border border-blue-500/20 items-center justify-center mr-2"
              style={{ overflow: 'hidden' }}
            >
              <LinearGradient
                colors={['rgba(96,165,250,0.1)', 'rgba(59,130,246,0.05)']}
                className="absolute inset-0 rounded-full"
              />
              {isPdfGenerating ? (
                <ActivityIndicator size="small" color="#60a5fa" />
              ) : (
                <MaterialIcons name="file-download" size={20} color="#60a5fa" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onClose}
              style={{ overflow: 'hidden' }}
              className="w-10 h-10 rounded-full border border-blue-500/20 items-center justify-center"
            >
              <LinearGradient
                colors={['rgba(96,165,250,0.1)', 'rgba(59,130,246,0.05)']}
                className="absolute inset-0 rounded-full"
              />
              <Ionicons name="close" size={24} color="#60a5fa" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="flex-1 relative">
          {isWeb ? renderWebContent() : renderNativeContent()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PreviewModal;