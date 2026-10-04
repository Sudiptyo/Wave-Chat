import { ComponentType } from "react";
import { FcGoogle } from "react-icons/fc";

export interface AuthSection {
  login: {
    identifier: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
    forgotPassword: string;
    submit: {
      idle: string;
      loading: string;
    };
    divider: string;
    google: {
      icon: ComponentType<{ className?: string; size?: number }>;
      text: string;
    };
  };

  register: {
    fullName: {
      label: string;
      placeholder: string;
    };
    username: {
      label: string;
      placeholder: string;
    };
    mobile: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
    submit: {
      idle: string;
      loading: string;
    };
    divider: string;
    google: {
      icon: ComponentType<{ className?: string; size?: number }>;
      text: string;
    };
  };
}

export const AuthSectionData: AuthSection = {
  login: {
    identifier: {
      label: "Mobile number or email",
      placeholder: "Mobile number or email",
    },

    password: {
      label: "Password",
      placeholder: "Your password",
    },

    forgotPassword: "Forgot password ?",

    submit: {
      idle: "Login",
      loading: "Logging in...",
    },

    divider: "or",

    google: {
      icon: FcGoogle,
      text: "Continue with Google",
    },
  },

  register: {
    fullName: {
      label: "Full Name",
      placeholder: "Your full name",
    },

    username: {
      label: "Username",
      placeholder: "Your username",
    },

    mobile: {
      label: "Mobile Number",
      placeholder: "Your mobile number",
    },

    password: {
      label: "Password",
      placeholder: "Create a password",
    },

    submit: {
      idle: "Create account",
      loading: "Creating account...",
    },

    divider: "or",

    google: {
      icon: FcGoogle,
      text: "Continue with Google",
    },
  },
};
