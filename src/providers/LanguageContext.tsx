import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Language {
  code: string;
  name: string;
}

interface LanguageContextType {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultLanguage: Language = { code: 'eng', name: 'English' };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage) {
          setSelectedLanguage(JSON.parse(savedLanguage));
        } else {
          setSelectedLanguage(defaultLanguage);
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
        setSelectedLanguage(defaultLanguage);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLanguage();
  }, []);

  // Save language when it changes
  const updateSelectedLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', JSON.stringify(language));
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Error saving language:', error);
      setSelectedLanguage(language);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage: updateSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 