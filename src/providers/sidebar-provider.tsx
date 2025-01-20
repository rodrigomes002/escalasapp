import { SidebarContext } from "@/context/sidebar-context";
import { useState } from "react";

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggle = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <SidebarContext.Provider value={{ isMinimized, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};
