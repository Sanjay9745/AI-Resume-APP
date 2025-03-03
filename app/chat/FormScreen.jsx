import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getResumePreview, sendChatMessage } from '../../api/chat';
import cdnUrl from '../../api/cdnUrl';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SubmitLoader from './SubmitLoader';
import PreviewModal from './PreviewModal';

export default function FormScreen({ sessionId, formSpec, onChatUpdate, onRestart, formData: initialFormData }) {
  const { templateId } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [resumePath, setResumePath] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [savedResumeState, setSavedResumeState] = useState(null);

  // Reset internal form state when sessionId changes
  useEffect(() => {
    if (!sessionId) {
      setShowDownload(false);
      setResumePath('');
    }
  }, [sessionId]);

  const handleRestart = () => {
    setShowDownload(false);
    setResumePath('');
    onRestart();
  };

  const handleRestartPress = () => {
    Alert.alert(
      "Restart Chat",
      "Are you sure you want to restart? This will clear all data.",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: onRestart
        }
      ]
    );
  };

  const camelToTitle = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^[a-z]/, (c) => c.toUpperCase());
  };

  const generateInitialFormData = () => {
    if (!formSpec) return {};
    if (initialFormData) return initialFormData;

    const initialData = {
      basicInfo: Object.keys(formSpec.required.basicInfo).reduce((acc, field) => {
        acc[field] = '';
        return acc;
      }, {})
    };

    Object.keys(formSpec.required.sections).forEach((sectionName) => {
      const sectionConfig = formSpec.required.sections[sectionName];
      if (sectionConfig.required) {
        initialData[sectionName] = [];
        if (sectionConfig.fields) {
          initialData[sectionName].push(
            sectionConfig.fields.reduce((item, field) => {
              item[field] = '';
              return item;
            }, {})
          );
        } else if (sectionConfig.suggestions) {
          initialData[sectionName] = [];
        }
      }
    });

    return initialData;
  };

  const [formData, setFormData] = useState(generateInitialFormData());
  const [currentSection, setCurrentSection] = useState('basicInfo');

  useEffect(() => {
    if (formSpec) {
      setFormData(generateInitialFormData());
    }
  }, [formSpec]);

  // Update form data when initialFormData changes
  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
    // Save to AsyncStorage immediately when form data changes
    if (templateId) {
      AsyncStorage.setItem(`form_${templateId}`, JSON.stringify(newFormData))
        .catch(error => console.error('Error saving form data:', error));
    }
  };

  const renderBasicInfo = () => {
    if (!formSpec?.required?.basicInfo) return null;
    
    return (
      <View className="bg-white/5 rounded-2xl border border-blue-500/20 p-4 mt-2">
        {Object.entries(formSpec.required.basicInfo).map(([field, isRequired]) => (
          <TextInput
            key={field}
            className="px-4 py-3 text-white bg-white/5 rounded-xl border border-blue-500/20 mt-4"
            placeholder={`Enter your ${camelToTitle(field)}${isRequired ? ' *' : ''}...`}
            placeholderTextColor="#94a3b8"
            value={formData.basicInfo[field]}
            onChangeText={(text) => {
              const newFormData = {
                ...formData,
                basicInfo: { ...formData.basicInfo, [field]: text },
              };
              handleFormDataChange(newFormData);
            }}
          />
        ))}
      </View>
    );
  };

  const renderDynamicSection = (sectionName) => {
    const sectionConfig = formSpec.required.sections[sectionName];
    const sections = formData[sectionName];

    if (!sectionConfig) return null;

    return (
      <View className="bg-white/5 rounded-2xl border border-blue-500/20 p-4 mt-2">
        {sections.map((item, index) => (
          <View key={index} className="mb-4">
            {sectionConfig.fields ? (
              sectionConfig.fields.map((field) => (
                <TextInput
                  key={field}
                  className="px-4 py-3 text-white bg-white/5 rounded-xl border border-blue-500/20 mb-2"
                  placeholder={`Enter ${camelToTitle(field)}...`}
                  placeholderTextColor="#94a3b8"
                  value={item[field]}
                  onChangeText={(text) => {
                    const newFormData = {
                      ...formData,
                      [sectionName]: formData[sectionName].map((i, iIndex) =>
                        iIndex === index ? { ...i, [field]: text } : i
                      ),
                    };
                    handleFormDataChange(newFormData);
                  }}
                />
              ))
            ) : sectionConfig.suggestions ? (
              <View className="flex-row items-center flex-wrap gap-2 mb-4">
                {sectionConfig.suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() => handleSkillToggle(sectionName, suggestion)}
                    className={`px-3 py-2 rounded-lg ${
                      formData[sectionName].includes(suggestion) 
                        ? 'bg-blue-500' 
                        : 'bg-white/5 border border-blue-500/20'
                    }`}
                  >
                    <Text className="text-white">{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 px-4 py-3 text-white bg-white/5 rounded-xl border border-blue-500/20"
                  placeholder={`Enter ${camelToTitle(sectionName)}...`}
                  placeholderTextColor="#94a3b8"
                  value={item}
                  onChangeText={(text) => {
                    const newFormData = {
                      ...formData,
                      [sectionName]: formData[sectionName].map((i, iIndex) => (iIndex === index ? text : i)),
                    };
                    handleFormDataChange(newFormData);
                  }}
                />
                <TouchableOpacity
                  onPress={() => handleRemoveItem(sectionName, index)}
                  className="ml-2"
                >
                  <Ionicons name="trash-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {!sectionConfig.suggestions && (
          <TouchableOpacity
            onPress={() => handleAddItem(sectionName)}
            className="mt-2"
          >
            <LinearGradient
              colors={['#60a5fa', '#3b82f6']}
              className="py-2 px-4 rounded-xl flex-row items-center justify-center"
              style={{ borderRadius: 10, overflow: 'hidden' }}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white ml-2">
                Add {sectionConfig.fields ? 'Entry' : 'Item'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleSkillToggle = (sectionName, skill) => {
    const newFormData = {
      ...formData,
      [sectionName]: formData[sectionName].includes(skill)
        ? formData[sectionName].filter(s => s !== skill)
        : [...formData[sectionName], skill]
    };
    handleFormDataChange(newFormData);
  };

  const handleAddItem = (sectionName) => {
    const sectionConfig = formSpec.required.sections[sectionName];
    const addItem = sectionConfig.fields
      ? sectionConfig.fields.reduce((acc, field) => {
          acc[field] = '';
          return acc;
        }, {})
      : '';
    const newFormData = {
      ...formData,
      [sectionName]: [...formData[sectionName], addItem],
    };
    handleFormDataChange(newFormData);
  };

  const handleRemoveItem = (sectionName, index) => {
    const newFormData = {
      ...formData,
      [sectionName]: formData[sectionName].filter((_, i) => i !== index),
    };
    handleFormDataChange(newFormData);
  };

  const handleSubmit = async () => {
    if (!sessionId || !templateId) {
      Alert.alert('Error', 'Session not initialized');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendChatMessage({
        message: JSON.stringify(formData),
        sessionId,
        isChat: false,
        isSubmit: true,
        templateId: String(templateId)
      });

      if (response.success) {
        setShowDownload(true);
        setResumePath(response.result.resumePath);
        setSavedResumeState(null); // Reset saved state after successful submission
        // Update chat messages and form data in parent component
        onChatUpdate(prev => [...prev, {
          id: Date.now().toString(),
          text: 'JSON_FORMAT_READY',
          isUser: false,
          timestamp: new Date(),
          isJson: true,
          jsonPath: response.result.resumePath,
          resumePath: response.result.resumePath
        }]);
        // Save final form state
        handleFormDataChange(formData);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (path) => {
    try {
      const url = `${cdnUrl}${path}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download the resume');
    }
  };

  const generatePreview = async () => {
    console.log('Generating preview...');
    if (!sessionId || !templateId) {
      Alert.alert('Error', 'Session not initialized');
      return;
    }
    
    setIsGeneratingPreview(true);
    try {
      let response = await getResumePreview(sessionId, formData);
      if (response.success) {
        setPreviewHtml(response.result);
        setShowPreviewModal(true); // Only open modal after receiving the response
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      Alert.alert('Error', 'Failed to generate preview. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handlePreview = async () => {
    setIsGeneratingPreview(true);
    try {
      let response = await getResumePreview(sessionId, formData);
      if (response.success) {
        setPreviewHtml(response.result);
        setShowPreviewModal(true); // Only show modal after successful API response
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      Alert.alert('Error', 'Failed to generate preview. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleResumeStateChange = (newState) => {
    setSavedResumeState(newState);
  };

  const ResumeDownload = () => (
    <View className="bg-white/5 rounded-2xl border border-blue-500/20 p-6 mt-4">
      <View className="items-center">
        <LinearGradient
          colors={['rgba(96,165,250,0.2)', 'rgba(59,130,246,0.1)']}
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
        >
          <MaterialIcons name="description" size={32} color="#60a5fa" />
        </LinearGradient>
        <Text className="text-white text-xl font-semibold mb-2">Resume Generated!</Text>
        <Text className="text-gray-400 text-center mb-6">
          Your resume has been generated successfully. You can download it now.
        </Text>
        <TouchableOpacity
          onPress={() => handleDownload(resumePath)}
          className="bg-blue-500 px-6 py-3 rounded-xl flex-row items-center mb-4"
        >
          <MaterialIcons name="file-download" size={24} color="white" />
          <Text className="text-white text-lg ml-2">Download Resume</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setShowPreviewModal(true)}
          className="bg-blue-500/30 px-6 py-3 rounded-xl flex-row items-center mb-4"
        >
          <MaterialIcons name="visibility" size={24} color="#60a5fa" />
          <Text className="text-blue-400 text-lg ml-2">Preview Resume</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleRestart}
          className="bg-white/10 px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="refresh" size={24} color="#60a5fa" />
          <Text className="text-blue-400 text-lg ml-2">Start New Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoaderOrForm = () => {
    if (isSubmitting) {
      return (
        <View className="flex-1 items-center justify-center">
          <SubmitLoader />
          <Text className="text-blue-400 mt-4">Generating your resume...</Text>
        </View>
      );
    }
    
    if (showDownload) {
      return <ResumeDownload />;
    }

    return (
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          className="mb-6"
        >
          {tabs.map((section) => (
            <TouchableOpacity
              key={section}
              onPress={() => setCurrentSection(section)}
              className={`px-4 py-2 rounded-xl mx-2 ${currentSection === section ? 'bg-blue-500' : 'bg-white/5'}`}
            >
              <Text className="text-white text-lg">
                {camelToTitle(section)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {currentSection === 'basicInfo' ? (
          renderBasicInfo()
        ) : (
          renderDynamicSection(currentSection)
        )}
        <TouchableOpacity
          onPress={generatePreview}
          disabled={isGeneratingPreview}
          className="bg-blue-500/30 px-6 py-3 rounded-xl flex-row items-center justify-center mt-4"
        >
          {isGeneratingPreview ? (
            <>
              <ActivityIndicator color="#60a5fa" size="small" />
              <Text className="text-blue-400 text-lg ml-2 text-center">Generating Preview...</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="visibility" size={24} color="#60a5fa" />
              <Text className="text-blue-400 text-lg ml-2 text-center">Preview Resume</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-6 mb-6"
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{ borderRadius: 10, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['#60a5fa', '#3b82f6']}
            className="w-full py-3 rounded-xl items-center justify-center"
          >
            <Text className="text-white text-lg">Submit Resume</Text>
          </LinearGradient>
        </TouchableOpacity>

      </>
    );
  };

  if (!formSpec) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-400 text-lg text-center mb-4">
          Chat first to generate the form
        </Text>
        <TouchableOpacity 
          onPress={handleRestartPress}
          className="bg-blue-500/20 px-4 py-2 rounded-full flex-row items-center"
        >
          <Ionicons name="refresh" size={20} color="#60a5fa" />
          <Text className="text-blue-400 ml-2">Restart Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tabs = ['basicInfo', ...Object.keys(formSpec.required.sections).filter(
    section => formSpec.required.sections[section].required
  )];

  return (
    <SafeAreaView className="flex-1 bg-[#0f1729]">
      <ScrollView className="flex-1 px-4">
        {renderLoaderOrForm()}
      </ScrollView>
      
      {/* Preview Modal */}
      <PreviewModal 
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        resumePath={resumePath}
        htmlContent={previewHtml}
        sessionId={sessionId}
        jsonData={formData}
      />
    </SafeAreaView>
  );
}