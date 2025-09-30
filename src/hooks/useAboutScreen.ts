import { useState, useEffect } from "react";
import { AppState } from "react-native";

export type AboutScreenView = "modal" | "list" | "detail";

export interface AboutItem {
  id: number;
  title: string;
  content: string;
}

export const useAboutScreen = () => {
  const [currentView, setCurrentView] = useState<AboutScreenView>("modal");
  const [selectedItem, setSelectedItem] = useState<AboutItem | null>(null);
  const [hasSeenModal, setHasSeenModal] = useState<boolean | null>(null);
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);

  // Track app state changes to detect cold start vs background return
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active" && !isSessionStarted) {
        // This is a cold start - show modal
        setIsSessionStarted(true);
        setHasSeenModal(false);
        setCurrentView("modal");
      } else if (nextAppState === "active" && isSessionStarted) {
        // This is returning from background - show list
        setHasSeenModal(true);
        setCurrentView("list");
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Initialize on first load
    if (!isSessionStarted) {
      setIsSessionStarted(true);
      setHasSeenModal(false);
      setCurrentView("modal");
    }

    return () => subscription?.remove();
  }, [isSessionStarted]);

  const closeModal = () => {
    setHasSeenModal(true);
    setCurrentView("list");
  };

  const navigateToDetail = (item: AboutItem) => {
    setSelectedItem(item);
    setCurrentView("detail");
  };

  const navigateBackToList = () => {
    setSelectedItem(null);
    setCurrentView("list");
  };

  const resetToModal = () => {
    setHasSeenModal(false);
    setCurrentView("modal");
    setSelectedItem(null);
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
