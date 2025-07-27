import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  StyleSheet, 
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

      fetchJoinUsData();
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {getLocalizedText(joinUsData?.fields?.submit ? { eng: 'Join Us' } : undefined)}
          </Text>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <TouchableOpacity 
              style={styles.descriptionHeader}
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.descriptionTitle}>
                {selectedLanguage?.code === 'hin' ? 'विवरण' : 'Description'}
              </Text>
              <Ionicons 
                name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#e94560" 
              />
            </TouchableOpacity>
            
            {isDescriptionExpanded && (
              <View style={styles.descriptionContent}>
                <Text style={styles.description}>
                  {getLocalizedText(joinUsData?.description)}
                </Text>
                <Text style={styles.caption}>
                  {getLocalizedText(joinUsData?.caption)}
                </Text>
              </View>
            )}
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {getLocalizedText(joinUsData?.fields?.name)} *
              </Text>
              <TextInput
                style={styles.input}
                placeholder={getLocalizedText(joinUsData?.fields?.name)}
                placeholderTextColor="#8b8b8b"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {getLocalizedText(joinUsData?.fields?.email)} *
              </Text>
              <TextInput
                style={styles.input}
                placeholder={getLocalizedText(joinUsData?.fields?.email)}
                placeholderTextColor="#8b8b8b"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Mobile Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {getLocalizedText(joinUsData?.fields?.mobile)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={getLocalizedText(joinUsData?.fields?.mobile)}
                placeholderTextColor="#8b8b8b"
                value={formData.mobile}
                onChangeText={(value) => updateFormData('mobile', value)}
                keyboardType="phone-pad"
              />
            </View>

            {/* City Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {getLocalizedText(joinUsData?.fields?.city)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={getLocalizedText(joinUsData?.fields?.city)}
                placeholderTextColor="#8b8b8b"
                value={formData.city}
                onChangeText={(value) => updateFormData('city', value)}
              />
            </View>

            {/* Country Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {getLocalizedText(joinUsData?.fields?.country)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={getLocalizedText(joinUsData?.fields?.country)}
                placeholderTextColor="#8b8b8b"
                value={formData.country}
                onChangeText={(value) => updateFormData('country', value)}
              />
            </View>

            {/* Comments Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {getLocalizedText(joinUsData?.fields?.comments)}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
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
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Submitting...' : getLocalizedText(joinUsData?.fields?.submit)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
    paddingTop: 80, // Add extra padding for status bar
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  descriptionContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2a2a3e',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  descriptionContent: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    color: '#e94560',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  submitButton: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#8b8b8b',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinUsModal; 