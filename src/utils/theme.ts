import { PrimaryColor } from '../types';

export interface ThemeColorStyles {
  bgPrimary: string;
  bgHover: string;
  bgLight: string;
  textPrimary: string;
  textDark: string;
  borderPrimary: string;
  badgeBg: string;
  badgeText: string;
  activeNav: string;
  headerBg: string;
}

export const COLOR_MAP: Record<PrimaryColor, ThemeColorStyles> = {
  emerald: {
    bgPrimary: 'bg-[#2E6F40]',
    bgHover: 'hover:bg-[#235832]',
    bgLight: 'bg-[#EAF3EC]',
    textPrimary: 'text-[#2E6F40]',
    textDark: 'text-[#1B4527]',
    borderPrimary: 'border-[#2E6F40]',
    badgeBg: 'bg-[#2E6F40]',
    badgeText: 'text-[#EAF3EC]',
    activeNav: 'text-[#2E6F40] bg-[#EAF3EC] font-bold scale-105 border border-[#2E6F40]/30',
    headerBg: 'bg-[#1E4D2B]',
  },
  amber: {
    bgPrimary: 'bg-[#7A4B29]',
    bgHover: 'hover:bg-[#633B1F]',
    bgLight: 'bg-[#FDF8F3]',
    textPrimary: 'text-[#7A4B29]',
    textDark: 'text-[#4D2D17]',
    borderPrimary: 'border-[#7A4B29]',
    badgeBg: 'bg-[#7A4B29]',
    badgeText: 'text-[#FDF8F3]',
    activeNav: 'text-[#7A4B29] bg-[#FDF8F3] font-bold scale-105 border border-[#7A4B29]/30',
    headerBg: 'bg-[#5C381E]',
  },
  blue: {
    bgPrimary: 'bg-[#2563EB]',
    bgHover: 'hover:bg-[#1D4ED8]',
    bgLight: 'bg-[#EFF6FF]',
    textPrimary: 'text-[#2563EB]',
    textDark: 'text-[#1E40AF]',
    borderPrimary: 'border-[#2563EB]',
    badgeBg: 'bg-[#2563EB]',
    badgeText: 'text-[#EFF6FF]',
    activeNav: 'text-[#2563EB] bg-[#EFF6FF] font-bold scale-105 border border-[#2563EB]/30',
    headerBg: 'bg-[#1E3A8A]',
  },
  indigo: {
    bgPrimary: 'bg-[#4F46E5]',
    bgHover: 'hover:bg-[#4338CA]',
    bgLight: 'bg-[#EEF2FF]',
    textPrimary: 'text-[#4F46E5]',
    textDark: 'text-[#3730A3]',
    borderPrimary: 'border-[#4F46E5]',
    badgeBg: 'bg-[#4F46E5]',
    badgeText: 'text-[#EEF2FF]',
    activeNav: 'text-[#4F46E5] bg-[#EEF2FF] font-bold scale-105 border border-[#4F46E5]/30',
    headerBg: 'bg-[#312E81]',
  },
  rose: {
    bgPrimary: 'bg-[#E11D48]',
    bgHover: 'hover:bg-[#BE123C]',
    bgLight: 'bg-[#FFF1F2]',
    textPrimary: 'text-[#E11D48]',
    textDark: 'text-[#9F1239]',
    borderPrimary: 'border-[#E11D48]',
    badgeBg: 'bg-[#E11D48]',
    badgeText: 'text-[#FFF1F2]',
    activeNav: 'text-[#E11D48] bg-[#FFF1F2] font-bold scale-105 border border-[#E11D48]/30',
    headerBg: 'bg-[#881337]',
  },
  purple: {
    bgPrimary: 'bg-[#9333EA]',
    bgHover: 'hover:bg-[#7E22CE]',
    bgLight: 'bg-[#FAF5FF]',
    textPrimary: 'text-[#9333EA]',
    textDark: 'text-[#6B21A8]',
    borderPrimary: 'border-[#9333EA]',
    badgeBg: 'bg-[#9333EA]',
    badgeText: 'text-[#FAF5FF]',
    activeNav: 'text-[#9333EA] bg-[#FAF5FF] font-bold scale-105 border border-[#9333EA]/30',
    headerBg: 'bg-[#581C87]',
  },
  orange: {
    bgPrimary: 'bg-[#EA580C]',
    bgHover: 'hover:bg-[#C2410C]',
    bgLight: 'bg-[#FFF7ED]',
    textPrimary: 'text-[#EA580C]',
    textDark: 'text-[#9A3412]',
    borderPrimary: 'border-[#EA580C]',
    badgeBg: 'bg-[#EA580C]',
    badgeText: 'text-[#FFF7ED]',
    activeNav: 'text-[#EA580C] bg-[#FFF7ED] font-bold scale-105 border border-[#EA580C]/30',
    headerBg: 'bg-[#7C2D12]',
  },
  teal: {
    bgPrimary: 'bg-[#0D9488]',
    bgHover: 'hover:bg-[#0F766E]',
    bgLight: 'bg-[#F0FDFA]',
    textPrimary: 'text-[#0D9488]',
    textDark: 'text-[#115E59]',
    borderPrimary: 'border-[#0D9488]',
    badgeBg: 'bg-[#0D9488]',
    badgeText: 'text-[#F0FDFA]',
    activeNav: 'text-[#0D9488] bg-[#F0FDFA] font-bold scale-105 border border-[#0D9488]/30',
    headerBg: 'bg-[#134E4A]',
  },
  gold: {
    bgPrimary: 'bg-[#CA8A04]',
    bgHover: 'hover:bg-[#A16207]',
    bgLight: 'bg-[#FEFCE8]',
    textPrimary: 'text-[#CA8A04]',
    textDark: 'text-[#854D0E]',
    borderPrimary: 'border-[#CA8A04]',
    badgeBg: 'bg-[#CA8A04]',
    badgeText: 'text-[#FEFCE8]',
    activeNav: 'text-[#CA8A04] bg-[#FEFCE8] font-bold scale-105 border border-[#CA8A04]/30',
    headerBg: 'bg-[#713F12]',
  },
  slate: {
    bgPrimary: 'bg-[#475569]',
    bgHover: 'hover:bg-[#334155]',
    bgLight: 'bg-[#F8FAFC]',
    textPrimary: 'text-[#475569]',
    textDark: 'text-[#1E293B]',
    borderPrimary: 'border-[#475569]',
    badgeBg: 'bg-[#475569]',
    badgeText: 'text-[#F8FAFC]',
    activeNav: 'text-[#475569] bg-[#F8FAFC] font-bold scale-105 border border-[#475569]/30',
    headerBg: 'bg-[#1E293B]',
  },
};

export const getThemeStyles = (primaryColor?: PrimaryColor): ThemeColorStyles => {
  return COLOR_MAP[primaryColor || 'emerald'] || COLOR_MAP.emerald;
};
