export interface MenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  isActive: boolean;
  onClick: () => void;
}
