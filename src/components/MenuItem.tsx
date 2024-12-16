import { MenuItemProps } from "@/types/MenuItemProps";

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  text,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon className="mr-2 h-4 w-4" />
    {text}
  </button>
);

export default MenuItem;
