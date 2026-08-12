import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationUIContext = 'Default' | 'Immersive' | 'Passive';

interface NavigationContextType {
  navContext: NavigationUIContext;
  setNavContext: (context: NavigationUIContext) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  navContext: 'Default',
  setNavContext: () => {},
});

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navContext, setNavContext] = useState<NavigationUIContext>('Default');

  return (
    <NavigationContext.Provider value={{ navContext, setNavContext }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationUIContext = () => useContext(NavigationContext);
