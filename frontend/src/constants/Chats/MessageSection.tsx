import {
  Camera,
  ChevronLeft,
  Ellipsis,
  FileText,
  Info,
  LucideIcon,
  Mic,
  Paperclip,
  Phone,
  Sticker,
  Video,
} from "lucide-react";
import type { IconType } from "react-icons";
import { TbHeadphonesFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { FaPollH } from "react-icons/fa";
import { PiSmileyStickerFill } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";
import { FaImages } from "react-icons/fa";

interface Icons {
  id: number;
  icon: LucideIcon | IconType;
  text?: string;
  hoverText?: string;
}

interface MessageSection {
  header: {
    left: {
      icon: LucideIcon;
      pfp: string;
      heading: string;
    };
    right: Icons[];
  };
  footer: {
    searchBar: {
      placeholder: string;
      attachment: {
        left: Icons[];
        right: Icons[];
      };
    };
    popOverContent: Icons[];
  };
}

const MessageSectionData: MessageSection = {
  header: {
    left: {
      icon: ChevronLeft,
      pfp: "ME",
      heading: "Sudiptyo",
    },

    right: [
      {
        id: 1,
        icon: Phone,
        hoverText: "Start audio call",
      },
      {
        id: 2,
        icon: Video,
        hoverText: "Start video call",
      },
      {
        id: 3,
        icon: Info,
        hoverText: "Person info",
      },
      {
        id: 4,
        icon: Ellipsis,
        hoverText: "More options",
      },
    ],
  },

  footer: {
    searchBar: {
      placeholder: "Message",
      attachment: {
        left: [
          {
            id: 1,
            icon: Sticker,
            hoverText: "Emojis, GIFs, Stickers",
          },
          {
            id: 2,
            icon: Paperclip,
            hoverText: "Attach",
          },
        ],
        right: [
          {
            id: 1,
            icon: Camera,
            hoverText: "Camera",
          },
          {
            id: 2,
            icon: Mic,
            hoverText: "Voice Message",
          },
        ],
      },
    },

    popOverContent: [
      {
        id: 1,
        icon: FileText,
        text: "Document",
      },
      {
        id: 2,
        icon: FaImages,
        text: "Photos & Videos",
      },
      {
        id: 3,
        icon: Camera,
        text: "Camera",
      },
      {
        id: 4,
        icon: TbHeadphonesFilled,
        text: "Audio",
      },
      {
        id: 5,
        icon: FaUser,
        text: "Contact",
      },
      {
        id: 6,
        icon: FaPollH,
        text: "Poll",
      },
      {
        id: 7,
        icon: PiSmileyStickerFill,
        text: "New sticker",
      },
      {
        id: 8,
        icon: FaLocationDot,
        text: "Location",
      },
    ],
  },
};

export default MessageSectionData;
