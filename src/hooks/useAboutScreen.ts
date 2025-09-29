import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AboutScreenView = "modal" | "list" | "detail";

export interface AboutItem {
  id: string;
  title: {
    ban: string;
    eng: string;
    hin: string;
  };
  description: {
    ban: string;
    eng: string;
    hin: string;
  };
  content: {
    ban: string;
    eng: string;
    hin: string;
  };
}

export const useAboutScreen = () => {
  const [currentView, setCurrentView] = useState<AboutScreenView>("modal");
  const [selectedItem, setSelectedItem] = useState<AboutItem | null>(null);
  const [hasSeenModal, setHasSeenModal] = useState<boolean | null>(null);

  // Check if user has seen the modal before
  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem("hasSeenAboutModal");
        if (hasSeen === "true") {
          setHasSeenModal(true);
          setCurrentView("list");
        } else {
          setHasSeenModal(false);
          setCurrentView("modal");
        }
      } catch (error) {
        console.error("Error checking modal status:", error);
        setHasSeenModal(false);
        setCurrentView("modal");
      }
    };

    checkModalStatus();
  }, []);

  const closeModal = async () => {
    try {
      await AsyncStorage.setItem("hasSeenAboutModal", "true");
      setHasSeenModal(true);
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving modal status:", error);
      setCurrentView("list");
    }
  };

  const navigateToDetail = (item: AboutItem) => {
    setSelectedItem(item);
    setCurrentView("detail");
  };

  const navigateBackToList = () => {
    setSelectedItem(null);
    setCurrentView("list");
  };

  const resetToModal = async () => {
    try {
      await AsyncStorage.removeItem("hasSeenAboutModal");
      setHasSeenModal(false);
      setCurrentView("modal");
      setSelectedItem(null);
    } catch (error) {
      console.error("Error resetting modal status:", error);
    }
  };

  return {
    currentView,
    selectedItem,
    hasSeenModal,
    closeModal,
    navigateToDetail,
    navigateBackToList,
    resetToModal,
  };
};
