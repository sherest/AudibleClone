import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal,
  Alert,
  StyleSheet
} from 'react-native';
import { useLanguage } from '../providers/LanguageContext';
import { useTheme } from '../providers/ThemeProvider';
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
  const { colors } = useTheme();
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
      // First, save to Firebase Realtime Database
      const messagesRef = ref(realtimeDb, 'community/messages/data');
      const newMessageRef = push(messagesRef);
      
      const messageData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        comment: formData.comments,
        city: formData.city,
        country: formData.country,
        timestamp: new Date().toISOString(),
        language: selectedLanguage?.code || 'eng'
      };

      await set(newMessageRef, messageData);

      // Reset form
      setFormData({
        name: '',
        email: '',
        mobile: '',
        city: '',
        country: '',
        comments: ''
      });

      Alert.alert('Success', 'Thank you for joining us!');
      hideJoinUs();
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isJoinUsVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={hideJoinUs}
    >
      <View style={[styles.container, {backgroundColor: colors.background.primary}]}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: colors.background.secondary, borderBottomColor: colors.border.primary}]}>
          <TouchableOpacity onPress={hideJoinUs} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            <Text style={[styles.backText, {color: colors.text.primary}]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.text.primary}]}>
            {getLocalizedText(menuData?.joinUs)}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* Description Card */}
          <View style={[styles.card, {backgroundColor: colors.background.secondary}]}>
            <Text style={[styles.descriptionTitle, {color: colors.text.primary}]}>
              {getLocalizedText(joinUsData?.titleDescription)}
            </Text>
            <Text style={[styles.descriptionText, {color: colors.text.secondary}]}>
              {getLocalizedText(joinUsData?.description)}
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, {backgroundColor: colors.background.secondary}]}>
            <Text style={[styles.formTitle, {color: colors.text.primary}]}>
              {getLocalizedText(joinUsData?.caption)}
            </Text>

            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {color: colors.text.primary}]}>
                {getLocalizedText(joinUsData?.fields?.name)} *
              </Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.background.tertiary, color: colors.text.primary, borderColor: colors.border.primary}]}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter your name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {color: colors.text.primary}]}>
                {getLocalizedText(joinUsData?.fields?.email)} *
              </Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.background.tertiary, color: colors.text.primary, borderColor: colors.border.primary}]}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
              />
            </View>

            {/* Mobile Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {color: colors.text.primary}]}>
                {getLocalizedText(joinUsData?.fields?.mobile)}
              </Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.background.tertiary, color: colors.text.primary, borderColor: colors.border.primary}]}
                value={formData.mobile}
                onChangeText={(text) => setFormData({...formData, mobile: text})}
                placeholder="Enter your mobile number"
                placeholderTextColor={colors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>

            {/* City Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {color: colors.text.primary}]}>
                {getLocalizedText(joinUsData?.fields?.city)}
              </Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.background.tertiary, color: colors.text.primary, borderColor: colors.border.primary}]}
                value={formData.city}
                onChangeText={(text) => setFormData({...formData, city: text})}
                placeholder="Enter your city"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            {/* Country Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {color: colors.text.primary}]}>
                {getLocalizedText(joinUsData?.fields?.country)}
              </Text>
              <TextInput
                style={[styles.textInput, {backgroundColor: colors.background.tertiary, color: colors.text.primary, borderColor: colors.border.primary}]}
                value={formData.country}
                onChangeText={(text) => setFormData({...formData, country: text})}
                placeholder="Enter your country"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            {/* Comments Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, {color: colors.text.primary}]}>
                {getLocalizedText(joinUsData?.fields?.comments)}
              </Text>
              <TextInput
                style={[styles.textArea, {backgroundColor: colors.background.tertiary, color: colors.text.primary, borderColor: colors.border.primary}]}
                value={formData.comments}
                onChangeText={(text) => setFormData({...formData, comments: text})}
                placeholder="Enter your comments"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, {backgroundColor: colors.primary}, loading && {backgroundColor: colors.text.secondary}]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[styles.submitButtonText, {color: colors.text.primary}]}>
                {loading ? 'Submitting...' : getLocalizedText(menuData?.joinUs)}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinUsModal; 