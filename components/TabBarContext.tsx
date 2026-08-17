import React, { createContext, useContext, useState } from "react";

interface TabBarContextType {
  isExpanded: boolean;
  expandTabBar: () => void;
  collapseTabBar: () => void;
}

const TabBarContext = createContext<TabBarContextType>({
  isExpanded: false,
  expandTabBar: () => {},
  collapseTabBar: () => {},
});

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TabBarContext.Provider
      value={{
        isExpanded,
        expandTabBar: () => setIsExpanded(true),
        collapseTabBar: () => setIsExpanded(false),
      }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);
