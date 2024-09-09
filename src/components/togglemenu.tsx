import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { MouseEventHandler } from "react";
interface ToggleMenuProps {
  handleToggleMenuOnClick: MouseEventHandler<HTMLButtonElement>;
  isToggleMenuOpen: boolean;
}

const ToggleMenu = ({
  handleToggleMenuOnClick,
  isToggleMenuOpen,
}: ToggleMenuProps) => (
  <button
    type="button"
    className="ml-1.5 inline-flex items-center rounded-lg p-2.5 text-sm text-gray-500 transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
    aria-label="Toggle Menu"
    onClick={handleToggleMenuOnClick}
  >
    {isToggleMenuOpen ? (
      <Cross1Icon className="h-6 w-6" />
    ) : (
      <HamburgerMenuIcon className="h-6 w-6" />
    )}
  </button>
);

export default ToggleMenu;
