import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../providers/LanguageContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const AboutScreen = () => {
  const { selectedLanguage } = useLanguage();

  const aboutContent = {
    en: {
      title: "About Amrita Lahari",
      subtitle: "Sacred Audio for Spiritual Growth",
      description: "Amrita Lahari is a sacred audio platform dedicated to spiritual growth through divine chants, prayers, and wisdom. Our mission is to provide authentic spiritual content that helps seekers on their journey towards enlightenment.",
      features: [
        "Sacred Chants & Bhajans",
        "Daily Prayers & Meditations", 
        "Spiritual Discourses",
        "Community Connection",
        "Multi-language Support"
      ],
      contact: "Contact Us",
      website: "Visit Website",
      email: "contact@amritalahari.com",
      websiteUrl: "http://www.amritalahari.com"
    },
    hi: {
      title: "अमृता लहरी के बारे में",
      subtitle: "आध्यात्मिक विकास के लिए पवित्र ऑडियो",
      description: "अमृता लहरी एक पवित्र ऑडियो प्लेटफॉर्म है जो दिव्य भजन, प्रार्थना और ज्ञान के माध्यम से आध्यात्मिक विकास के लिए समर्पित है। हमारा मिशन प्रामाणिक आध्यात्मिक सामग्री प्रदान करना है जो साधकों को ज्ञान की ओर उनकी यात्रा में मदद करती है।",
      features: [
        "पवित्र भजन और कीर्तन",
        "दैनिक प्रार्थना और ध्यान",
        "आध्यात्मिक प्रवचन",
        "समुदाय कनेक्शन",
        "बहुभाषी समर्थन"
      ],
      contact: "संपर्क करें",
      website: "वेबसाइट देखें",
      email: "contact@amritalahari.com",
      websiteUrl: "http://www.amritalahari.com"
    }
  };

  const content = aboutContent[selectedLanguage?.code as keyof typeof aboutContent] || aboutContent.en;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>{content.title}</Text>
          <Text style={styles.headerSubtitle}>{content.subtitle}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.description}>{content.description}</Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedLanguage?.code === 'hi' ? 'विशेषताएं' : 'Features'}
        </Text>
        {content.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <FontAwesome5 name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{content.contact}</Text>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`mailto:${content.email}`)}
        >
          <MaterialIcons name="email" size={24} color="#e94560" />
          <Text style={styles.contactText}>{content.email}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(content.websiteUrl)}
        >
          <FontAwesome5 name="globe" size={24} color="#e94560" />
          <Text style={styles.contactText}>{content.website}</Text>
        </TouchableOpacity>
      </View>

      {/* Version Info */}
      <View style={styles.versionSection}>
        <Text style={styles.versionText}>
          Version 1.0.0
        </Text>
        <Text style={styles.copyrightText}>
          © 2024 Amrita Lahari. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e94560',
  },
  section: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
  },
  versionSection: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#8b8b8b',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#8b8b8b',
    textAlign: 'center',
  },
});

export default AboutScreen; 