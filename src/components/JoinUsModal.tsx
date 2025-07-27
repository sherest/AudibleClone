import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal,
  Alert
} from 'react-native';
import { useLanguage } from '../providers/LanguageContext';
import { realtimeDb } from '../lib/firebase';
import { ref, onValue, push, set } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';
import { useJoinUs } from '../providers/JoinUsProvider';

interface JoinUsData {
  caption: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  titleDescription: {
    [key: string]: string;
  };
  fields: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

const JoinUsModal = () => {
  const { isJoinUsVisible, hideJoinUs } = useJoinUs();
  const { selectedLanguage } = useLanguage();
  const [joinUsData, setJoinUsData] = useState<JoinUsData | null>(null);
  const [menuData, setMenuData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    country: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

  useEffect(() => {
    if (isJoinUsVisible) {
      const fetchJoinUsData = () => {
        const joinUsRef = ref(realtimeDb, 'join_us');
        onValue(joinUsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setJoinUsData(data);
          }
        });
      };

      const fetchMenuData = () => {
        const menuRef = ref(realtimeDb, 'menu');
        onValue(menuRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setMenuData(data);
          }
        });
      };

      fetchJoinUsData();
      fetchMenuData();
    }
  }, [isJoinUsVisible, selectedLanguage]);

  const getLocalizedText = (textObj: { [key: string]: string } | undefined) => {
    if (!textObj) return '';
    return textObj[selectedLanguage?.code as keyof typeof textObj] || textObj.eng || '';
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and Email are required fields');
      return;
    }

    setLoading(true);
    try {
      const messagesRef = ref(realtimeDb, 'community/messages/data');
      const newMessageRef = push(messagesRef);
      
      await set(newMessageRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        message: formData.comments,
        city: formData.city,
        country: formData.country,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0]
      });

      Alert.alert(
        'Success', 
        'Thank you for joining us! We will keep you updated on our activities.',
        [{ text: 'OK', onPress: () => handleClose() }]
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    setFormData({
      name: '',
      email: '',
      mobile: '',
      city: '',
      country: '',
      comments: ''
    });
    hideJoinUs();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isJoinUsVisible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-[#0f3460]">
        {/* Header */}
        <View className="flex-row justify-between items-center p-5 bg-[#1a1a2e] border-b border-[#2a2a3e] pt-20">
          <Text className="text-2xl font-bold text-white">
            {getLocalizedText(menuData?.joinUs) || 'Join Us'}
          </Text>
          
          <TouchableOpacity 
            className="p-1"
            onPress={handleClose}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View className="bg-[#1a1a2e] rounded-2xl mb-5 overflow-hidden">
            <TouchableOpacity 
              className="flex-row justify-between items-center p-5 bg-[#2a2a3e]"
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              activeOpacity={0.7}
            >
              <Text className="text-base font-bold text-white">
                {getLocalizedText(joinUsData?.titleDescription) || 'Description'}
              </Text>
              <Ionicons 
                name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#e94560" 
              />
            </TouchableOpacity>
            
            {isDescriptionExpanded && (
              <View className="p-5">
                <Text className="text-lg text-white mb-2">
                  {getLocalizedText(joinUsData?.description)}
                </Text>
                <Text className="text-sm text-[#e94560] italic">
                  {getLocalizedText(joinUsData?.caption)}
                </Text>
              </View>
            )}
          </View>

          {/* Form */}
          <View className="bg-[#1a1a2e] p-5 rounded-2xl mb-20">
            {/* Name Field */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-white mb-2">
                {getLocalizedText(joinUsData?.fields?.name)} *
              </Text>
              <TextInput
                className="bg-[#2a2a3e] rounded-xl p-4 text-base text-white border border-[#3a3a4e]"
                placeholder={getLocalizedText(joinUsData?.fields?.name)}
                placeholderTextColor="#8b8b8b"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>

            {/* Email Field */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-white mb-2">
                {getLocalizedText(joinUsData?.fields?.email)} *
              </Text>
              <TextInput
                className="bg-[#2a2a3e] rounded-xl p-4 text-base text-white border border-[#3a3a4e]"
                placeholder={getLocalizedText(joinUsData?.fields?.email)}
                placeholderTextColor="#8b8b8b"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Mobile Field */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-white mb-2">
                {getLocalizedText(joinUsData?.fields?.mobile)}
              </Text>
              <TextInput
                className="bg-[#2a2a3e] rounded-xl p-4 text-base text-white border border-[#3a3a4e]"
                placeholder={getLocalizedText(joinUsData?.fields?.mobile)}
                placeholderTextColor="#8b8b8b"
                value={formData.mobile}
                onChangeText={(value) => updateFormData('mobile', value)}
                keyboardType="phone-pad"
              />
            </View>

            {/* City Field */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-white mb-2">
                {getLocalizedText(joinUsData?.fields?.city)}
              </Text>
              <TextInput
                className="bg-[#2a2a3e] rounded-xl p-4 text-base text-white border border-[#3a3a4e]"
                placeholder={getLocalizedText(joinUsData?.fields?.city)}
                placeholderTextColor="#8b8b8b"
                value={formData.city}
                onChangeText={(value) => updateFormData('city', value)}
              />
            </View>

            {/* Country Field */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-white mb-2">
                {getLocalizedText(joinUsData?.fields?.country)}
              </Text>
              <TextInput
                className="bg-[#2a2a3e] rounded-xl p-4 text-base text-white border border-[#3a3a4e]"
                placeholder={getLocalizedText(joinUsData?.fields?.country)}
                placeholderTextColor="#8b8b8b"
                value={formData.country}
                onChangeText={(value) => updateFormData('country', value)}
              />
            </View>

            {/* Comments Field */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-white mb-2">
                {getLocalizedText(joinUsData?.fields?.comments)}
              </Text>
              <TextInput
                className="bg-[#2a2a3e] rounded-xl p-4 text-base text-white border border-[#3a3a4e] h-24 pt-4"
                placeholder={getLocalizedText(joinUsData?.fields?.comments)}
                placeholderTextColor="#8b8b8b"
                value={formData.comments}
                onChangeText={(value) => updateFormData('comments', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              className={`bg-[#e94560] rounded-xl p-4 items-center mt-2 ${loading ? 'bg-gray-500' : ''}`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-base font-bold text-white">
                {loading ? 'Submitting...' : getLocalizedText(joinUsData?.fields?.submit)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default JoinUsModal; 