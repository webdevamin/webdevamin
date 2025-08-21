import {
  // Social Media Icons
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Youtube,

  // Communication Icons
  Mail,
  Phone,
  MessageCircle,

  // Navigation & Location Icons
  MapPin,
  ExternalLink,
  Home,
  Globe,

  // Business & Professional Icons
  Briefcase,
  Building,
  Image,
  Bookmark,
  BookUser,

  // Content & File Icons
  FileText,
  Info,
  Settings,

  // E-commerce & Actions
  ShoppingCart,
  Heart,

  // Calendar & Time Icons
  CalendarDays,

  // Technology & Tools Icons
  Smartphone,
  CreditCard,
  Calculator,
  Search,
  PanelTop,

  // Status & Feedback Icons
  CheckCircle,
  Star,
} from 'lucide-react';

/**
 * Centralized icon mapping configuration for Lucide React icons
 * This provides a single source of truth for all icon mappings across the application
 */
const iconMap = {
  // Social Media
  'facebook': Facebook,
  'twitter': Twitter,
  'linkedin': Linkedin,
  'instagram': Instagram,
  'github': Github,
  'youtube': Youtube,

  // Communication
  'mail': Mail,
  'phone': Phone,
  'message-circle': MessageCircle,

  // Navigation & Location
  'map-pin': MapPin,
  'external-link': ExternalLink,
  'home': Home,
  'globe': Globe,

  // Business & Professional
  'briefcase': Briefcase,
  'building': Building,
  'image': Image,
  'bookmark': Bookmark,
  // Support both legacy and canonical names
  'address-book': BookUser,

  // Content & File
  'file-text': FileText,
  'info': Info,
  'settings': Settings,

  // E-commerce & Actions
  'shopping-cart': ShoppingCart,
  'heart': Heart,

  // Calendar & Time
  'calendar-days': CalendarDays,
  'CalendarDays': CalendarDays, // Support both formats

  // Technology & Tools
  'smartphone': Smartphone,
  'Smartphone': Smartphone, // Support both formats
  'credit-card': CreditCard,
  'CreditCard': CreditCard, // Support both formats
  'calculator': Calculator,
  'Calculator': Calculator, // Support both formats
  'search': Search,
  'Search': Search, // Support both formats
  'panel-top': PanelTop,
  'PanelTop': PanelTop,

  // Status & Feedback
  'check-circle': CheckCircle,
  'CheckCircle': CheckCircle, // Support both formats
  'star': Star,
  'Star': Star, // Support both formats
};

/**
 * Get a Lucide React icon component by name
 * @param {string} iconName - The name of the icon (kebab-case or PascalCase)
 * @param {Object} props - Props to pass to the icon component
 * @returns {React.Component|null} The icon component or Globe as fallback
 */
export const getIconComponent = (iconName, props = {}) => {
  if (!iconName) return Globe;
  // Support passing an icon object with { name }
  const candidate = typeof iconName === 'object' && iconName !== null
    ? (iconName.name || '')
    : iconName;
  // Normalize: accept strings, numbers, etc.; support kebab/pascal; case-insensitive
  const keyRaw = String(candidate).trim();
  const keyLower = keyRaw.toLowerCase();
  const IconComponent = iconMap[keyRaw] || iconMap[keyLower] || Globe;
  return IconComponent;
};

/**
 * Render an icon with default props
 * @param {string} iconName - The name of the icon
 * @param {Object} props - Props to pass to the icon component (size, className, etc.)
 * @returns {JSX.Element} The rendered icon component
 */
export const renderIcon = (iconName, props = {}) => {
  const IconComponent = getIconComponent(iconName);
  const defaultProps = {
    size: 20,
    ...props
  };

  return <IconComponent {...defaultProps} />;
};

/**
 * Check if an icon exists in the mapping
 * @param {string} iconName - The name of the icon to check
 * @returns {boolean} True if icon exists, false otherwise
 */
export const hasIcon = (iconName) => {
  return iconName && iconMap.hasOwnProperty(iconName);
};

/**
 * Get all available icon names
 * @returns {string[]} Array of all available icon names
 */
export const getAvailableIcons = () => {
  return Object.keys(iconMap);
};

export default {
  getIconComponent,
  renderIcon,
  hasIcon,
  getAvailableIcons,
  iconMap
};
