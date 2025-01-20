import { createContext } from "react";

export const SidebarContext = createContext<{
  isMinimized: boolean;
  toggle: () => void;
}>({
  isMinimized: false,
  toggle: () => {},
});
