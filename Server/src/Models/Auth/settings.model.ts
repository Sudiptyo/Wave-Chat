import { model, Schema, Types } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

export const Profile_Visibility = {
  PUBLIC: "public",
  CONTACTS: "contacts",
  PRIVATE: "private",
} as const;

export type ProfileVisibility =
  (typeof Profile_Visibility)[keyof typeof Profile_Visibility];

export const Last_Seen_Visibility = {
  EVERYONE: "everyone",
  CONTACTS: "contacts",
  NOBODY: "nobody",
} as const;

export type LastSeenVisibility =
  (typeof Last_Seen_Visibility)[keyof typeof Last_Seen_Visibility];

export const Call_Privacy = {
  EVERYONE: "everyone",
  CONTACTS: "contacts",
  NOBODY: "nobody",
} as const;

export type CallPrivacy = (typeof Call_Privacy)[keyof typeof Call_Privacy];

export const Group_Add_Permission = {
  EVERYONE: "everyone",
  CONTACTS: "contacts",
  NOBODY: "nobody",
} as const;

export type GroupAddPermission =
  (typeof Group_Add_Permission)[keyof typeof Group_Add_Permission];

export const Theme_Type = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
} as const;

export type ThemeType = (typeof Theme_Type)[keyof typeof Theme_Type];

export const Font_Size = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  EXTRA_LARGE: "extra_large",
} as const;

export type FontSize = (typeof Font_Size)[keyof typeof Font_Size];

export const Media_Auto_Download = {
  NEVER: "never",
  WIFI: "wifi",
  WIFI_AND_MOBILE: "wifi_and_mobile",
} as const;

export type MediaAutoDownload =
  (typeof Media_Auto_Download)[keyof typeof Media_Auto_Download];

export const Upload_Quality = {
  STANDARD: "standard",
  HD: "hd",
} as const;

export type UploadQuality =
  (typeof Upload_Quality)[keyof typeof Upload_Quality];

/* -------------------------------------------------------------------------- */
/*                               ACCOUNT SETTINGS                             */
/* -------------------------------------------------------------------------- */

export interface IAccountSettings {
  loginAlerts: boolean;
  twoFactorAuthentication: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               PRIVACY SETTINGS                             */
/* -------------------------------------------------------------------------- */

export interface IPrivacySettings {
  profileVisibility: ProfileVisibility;
  lastSeen: LastSeenVisibility;
  onlineStatus: boolean;
  readReceipts: boolean;
  typingIndicator: boolean;
  profilePhoto: ProfileVisibility;
  about: ProfileVisibility;
  status: ProfileVisibility;
  calls: CallPrivacy;
  groups: GroupAddPermission;
}

/* -------------------------------------------------------------------------- */
/*                                CHAT SETTINGS                               */
/* -------------------------------------------------------------------------- */

export interface IChatSettings {
  enterToSend: boolean;
  sendWithCtrlEnter: boolean;
  linkPreviews: boolean;
  saveToGallery: boolean;
  disappearingMessages: boolean;
  archiveChats: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             APPEARANCE SETTINGS                            */
/* -------------------------------------------------------------------------- */

export interface IAppearanceSettings {
  theme: ThemeType;
  accentColor: string;
  fontSize: FontSize;
  chatWallpaper?: string;
  compactMode: boolean;
  animations: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           NOTIFICATION SETTINGS                            */
/* -------------------------------------------------------------------------- */

export interface INotificationSettings {
  enabled: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  friendRequestNotifications: boolean;
  callNotifications: boolean;
  storyNotifications: boolean;
  aiNotifications: boolean;
  sound: boolean;
  vibration: boolean;
  desktopNotifications: boolean;
  showPreview: boolean;
  notificationTone?: string;
}

/* -------------------------------------------------------------------------- */
/*                           STORAGE & DATA SETTINGS                          */
/* -------------------------------------------------------------------------- */

export interface IStorageDataSettings {
  mobileDataAutoDownload: MediaAutoDownload;
  wifiAutoDownload: MediaAutoDownload;
  roamingAutoDownload: MediaAutoDownload;
  uploadQuality: UploadQuality;
  downloadMediaAutomatically: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              LANGUAGE SETTINGS                             */
/* -------------------------------------------------------------------------- */

export interface IAppLanguageSettings {
  language: string;
  translationEnabled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              MAIN INTERFACE                                */
/* -------------------------------------------------------------------------- */

export interface IUserSettings {
  userId: Types.ObjectId;
  account: IAccountSettings;
  privacy: IPrivacySettings;
  chats: IChatSettings;
  appearance: IAppearanceSettings;
  notifications: INotificationSettings;
  storageAndData: IStorageDataSettings;
  appLanguage: IAppLanguageSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    account: {
      loginAlerts: {
        type: Boolean,
        default: true,
      },

      twoFactorAuthentication: {
        type: Boolean,
        default: false,
      },
    },

    privacy: {
      profileVisibility: {
        type: String,
        enum: Object.values(Profile_Visibility),
        default: Profile_Visibility.PUBLIC,
      },

      lastSeen: {
        type: String,
        enum: Object.values(Last_Seen_Visibility),
        default: Last_Seen_Visibility.CONTACTS,
      },

      onlineStatus: {
        type: Boolean,
        default: true,
      },

      readReceipts: {
        type: Boolean,
        default: true,
      },

      typingIndicator: {
        type: Boolean,
        default: true,
      },

      profilePhoto: {
        type: String,
        enum: Object.values(Profile_Visibility),
        default: Profile_Visibility.CONTACTS,
      },

      about: {
        type: String,
        enum: Object.values(Profile_Visibility),
        default: Profile_Visibility.CONTACTS,
      },

      status: {
        type: String,
        enum: Object.values(Profile_Visibility),
        default: Profile_Visibility.CONTACTS,
      },

      calls: {
        type: String,
        enum: Object.values(Call_Privacy),
        default: Call_Privacy.CONTACTS,
      },

      groups: {
        type: String,
        enum: Object.values(Group_Add_Permission),
        default: Group_Add_Permission.CONTACTS,
      },
    },

    chats: {
      enterToSend: {
        type: Boolean,
        default: true,
      },

      sendWithCtrlEnter: {
        type: Boolean,
        default: false,
      },

      linkPreviews: {
        type: Boolean,
        default: true,
      },

      saveToGallery: {
        type: Boolean,
        default: true,
      },

      disappearingMessages: {
        type: Boolean,
        default: false,
      },

      archiveChats: {
        type: Boolean,
        default: false,
      },
    },

    appearance: {
      theme: {
        type: String,
        enum: Object.values(Theme_Type),
        default: Theme_Type.SYSTEM,
      },

      accentColor: {
        type: String,
        default: "#7C3AED",
      },

      fontSize: {
        type: String,
        enum: Object.values(Font_Size),
        default: Font_Size.MEDIUM,
      },

      chatWallpaper: {
        type: String,
      },

      compactMode: {
        type: Boolean,
        default: false,
      },

      animations: {
        type: Boolean,
        default: true,
      },
    },

    notifications: {
      enabled: {
        type: Boolean,
        default: true,
      },

      messageNotifications: {
        type: Boolean,
        default: true,
      },

      groupNotifications: {
        type: Boolean,
        default: true,
      },

      friendRequestNotifications: {
        type: Boolean,
        default: true,
      },

      callNotifications: {
        type: Boolean,
        default: true,
      },

      storyNotifications: {
        type: Boolean,
        default: true,
      },

      aiNotifications: {
        type: Boolean,
        default: true,
      },

      sound: {
        type: Boolean,
        default: true,
      },

      vibration: {
        type: Boolean,
        default: true,
      },

      desktopNotifications: {
        type: Boolean,
        default: true,
      },

      showPreview: {
        type: Boolean,
        default: true,
      },

      notificationTone: {
        type: String,
      },
    },

    storageAndData: {
      mobileDataAutoDownload: {
        type: String,
        enum: Object.values(Media_Auto_Download),
        default: Media_Auto_Download.WIFI,
      },

      wifiAutoDownload: {
        type: String,
        enum: Object.values(Media_Auto_Download),
        default: Media_Auto_Download.WIFI_AND_MOBILE,
      },

      roamingAutoDownload: {
        type: String,
        enum: Object.values(Media_Auto_Download),
        default: Media_Auto_Download.NEVER,
      },

      uploadQuality: {
        type: String,
        enum: Object.values(Upload_Quality),
        default: Upload_Quality.STANDARD,
      },

      downloadMediaAutomatically: {
        type: Boolean,
        default: true,
      },
    },

    appLanguage: {
      language: {
        type: String,
        default: "en",
      },

      translationEnabled: {
        type: Boolean,
        default: false,
      },
    },
  },

  { timestamps: true },
);

userSettingsSchema.index({ userId: 1 }, { unique: true });

export const UserSettings = model<IUserSettings>(
  "UserSettings",
  userSettingsSchema,
);
