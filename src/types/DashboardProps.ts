import { MenuOption } from "./MenuOption";

export interface DashboardProps {
  activeMenu: MenuOption;
  setActiveMenu: (menu: MenuOption) => void;
}
