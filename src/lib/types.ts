export interface HeaderProps {
  links?: Array<MenuLink>;
  //   actions?: Array<CallToAction>;
  // actions?: Array<ActionLink>;
  isSticky?: boolean;
  showToggleTheme?: boolean;
  showRssFeed?: boolean;
  position?: "center" | "right" | "left";
}

export interface MenuLink extends Link {
  links?: Array<Link>;
}

// interface CallToAction {
//   text: string;
//   href: string;
//   icon?: Function;
//   targetBlank?: boolean;
//   btnText?: "uppercase" | "capitalize";
//   btnType?: "primary" | "secondary";
// }

export interface Link {
  label?: string;
  href?: string;
  ariaLabel?: string;
  icon?: React.ElementType;
}
