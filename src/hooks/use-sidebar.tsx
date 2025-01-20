import { SidebarContext } from "@/context/sidebar-context";
import { useContext } from "react";

export const useSidebar = () => useContext(SidebarContext);
