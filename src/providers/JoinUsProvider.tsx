import React, { createContext, useContext, useState, ReactNode } from 'react';

interface JoinUsContextType {
  isJoinUsVisible: boolean;
  showJoinUs: () => void;
  hideJoinUs: () => void;
}

const JoinUsContext = createContext<JoinUsContextType | undefined>(undefined);

export const JoinUsProvider = ({ children }: { children: ReactNode }) => {
  const [isJoinUsVisible, setIsJoinUsVisible] = useState(false);

  const showJoinUs = () => {
    setIsJoinUsVisible(true);
  };

  const hideJoinUs = () => {
    setIsJoinUsVisible(false);
  };

  return (
    <JoinUsContext.Provider value={{ isJoinUsVisible, showJoinUs, hideJoinUs }}>
      {children}
    </JoinUsContext.Provider>
  );
};

export const useJoinUs = () => {
  const context = useContext(JoinUsContext);
  if (!context) {
    throw new Error('useJoinUs must be used within a JoinUsProvider');
  }
  return context;
}; 