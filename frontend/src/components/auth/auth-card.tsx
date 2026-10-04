"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";

type AuthTab = "login" | "register";

interface AuthCardProps {
  initialTab: AuthTab;
}

const AuthCard = ({ initialTab }: AuthCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryTab = searchParams.get("tab");

  const activeTab: AuthTab =
    queryTab === "login" || queryTab === "register" ? queryTab : initialTab;

  const handleTabChange = (value: string) => {
    if (value !== "login" && value !== "register") return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const isLogin = activeTab === "login";

  return (
    <div className="w-full max-w-117.5 rounded-[28px] border border-white/10 bg-[#0b2430]/90 px-7 py-7 shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl max-sm:min-h-screen max-sm:max-w-none max-sm:rounded-none max-sm:border-0 max-sm:shadow-none sm:px-8 sm:py-8">
      {/* Logo */}
      <div className="mb-5 flex justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f2eb] text-xl font-bold text-[#153c3a]">
          W
        </div>
      </div>

      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-white">
          {isLogin ? "Welcome back" : "Create your Wavechat account"}
        </h1>

        <p className="mt-2 text-[12px] leading-5 text-white/55">
          {isLogin
            ? "Connect to your conversations, communities, calls and AI."
            : "Set up your chat identity in a few simple steps."}
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="auth-tabs-list">
          <TabsTrigger
            value="login"
            className={`auth-tab ${
              activeTab === "login" ? "auth-tab-active" : ""
            }`}
          >
            Login
          </TabsTrigger>

          <TabsTrigger
            value="register"
            className={`auth-tab ${
              activeTab === "register" ? "auth-tab-active" : ""
            }`}
          >
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-5 focus-visible:outline-none">
          <LoginForm />
        </TabsContent>

        <TabsContent
          value="register"
          className="mt-5 focus-visible:outline-none"
        >
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthCard;
