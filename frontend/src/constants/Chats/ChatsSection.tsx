import { LucideIcon, Plus, Search } from "lucide-react";

interface ChatSection {
  header: {
    heading: string;
    description: string;
    icon: LucideIcon;
  };

  search: {
    icon: LucideIcon;
    placeholder: string;
  };

  messageTypes: {
    id: number;
    type: string;
    href?: string;
  }[];

  messages: {
    id: number;
    pfp?: string;
    sender: string;
    message: string;
    timestamp: string;
    count?: number;
    href?: string;
  }[];
}

const ChatsSectionData: ChatSection = {
  header: {
    heading: "YOUR PRIVATE ROOM",
    description: "Chats",
    icon: Plus,
  },

  search: {
    icon: Search,
    placeholder: "Search ...",
  },

  messageTypes: [
    {
      id: 1,
      type: "All",
      href: "/chats",
    },
    {
      id: 2,
      type: "Direct",
      href: "/direct-chats",
    },
    {
      id: 3,
      type: "Group",
      href: "/group-chats",
    },
    {
      id: 4,
      type: "Unread",
      href: "/unread-chats",
    },
  ],

  messages: [
    {
      id: 1,
      pfp: "ME",
      sender: "Sudiptyo Das",
      message: "Hello",
      timestamp: "12:00",
      count: 4,
      href: "/chats/1",
    },
    {
      id: 2,
      pfp: "AD",
      sender: "Ani Renda",
      message: "Hello",
      timestamp: "10:50",
      count: 1,
      href: "/chats/2",
    },
    {
      id: 3,
      pfp: "SD",
      sender: "Nigga",
      message: "Hello",
      timestamp: "6:27",
      href: "/chats/3",
    },
  ],
};

export { ChatsSectionData };
