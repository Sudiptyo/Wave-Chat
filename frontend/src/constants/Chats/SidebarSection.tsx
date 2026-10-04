import {
  AudioWaveform,
  Bell,
  Coins,
  Gauge,
  Moon,
  PhoneCall,
  Radio,
  Settings,
  Sparkles,
  Sun,
  UsersRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface SidebarItem {
  id: number;
  icon: LucideIcon;
  hoverText: string;
  href?: string;
}

interface SidebarSection {
  logo: {
    text: string;
  };

  body: SidebarItem[];

  footer: SidebarItem[];
}

const SidebarSectionData: SidebarSection = {
  logo: {
    text: "W",
  },

  body: [
    {
      id: 1,
      icon: AudioWaveform,
      hoverText: "Chats",
      href: "/chats",
    },

    {
      id: 2,
      icon: Sparkles,
      hoverText: "Wave AI workspace",
      href: "/ai",
    },

    {
      id: 3,
      icon: Radio,
      hoverText: "Updates",
      href: "/updates",
    },

    {
      id: 4,
      icon: UsersRound,
      hoverText: "Communities",
      href: "/communities",
    },

    {
      id: 5,
      icon: PhoneCall,
      hoverText: "Calls",
      href: "/calls",
    },

    {
      id: 6,
      icon: Bell,
      hoverText: "Notifications",
      href: "/notifications",
    },
  ],

  footer: [
    {
      id: 1,
      icon: Sun,
      hoverText: "Switch theme",
    },

    {
      id: 2,
      icon: Settings,
      hoverText: "Settings",
      href: "/settings",
    },

    {
      id: 3,
      icon: Gauge,
      hoverText: "AI Credits",
      href: "/settings/credits",
    },
  ],
};

export { SidebarSectionData };
