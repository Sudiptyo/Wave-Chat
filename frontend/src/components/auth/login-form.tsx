"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthSectionData } from "@/constants/AuthSection";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { type LoginFormValues, loginUserSchema } from "@/lib/validation/auth";
import { FaAngleRight } from "react-icons/fa6";
import { useLoginMutation } from "@/hooks/queries/use-auth-query";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutateAsync: loginMutation, isPending } = useLoginMutation();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation(data);

      toast.success("Login successful");
      form.reset();

      router.replace("/chat");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error(err.response.data.message);
        return;
      }

      toast.error("Something went wrong");
      form.reset();
      console.error(err);
    }
  };

  const login = AuthSectionData.login;
  const Icon = login.google.icon;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        {/* Identifier */}
        <Controller
          name="identifier"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-identifier" className="text-white/70">
                {login.identifier.label}
              </FieldLabel>

              <Input
                {...field}
                id="login-identifier"
                placeholder={login.identifier.placeholder}
                autoComplete="username"
                aria-invalid={fieldState.invalid}
                className="h-11 border-white/15 bg-[#142d38] text-white placeholder:text-white/35 focus-visible:border-[#72d2ad] focus-visible:ring-[#72d2ad]/20"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password" className="text-white/70">
                {login.password.label}
              </FieldLabel>

              <div className="relative">
                <Input
                  {...field}
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={login.password.placeholder}
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  className="h-11 border-white/15 bg-[#142d38] pr-12 text-white placeholder:text-white/35 focus-visible:border-[#72d2ad] focus-visible:ring-[#72d2ad]/20"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#72d2ad] hover:text-[#8be1c0]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Forgot password */}
        <div className="-mt-1 flex justify-end">
          <a
            href="/forgot-password"
            className="text-xs font-semibold text-[#72d2ad] hover:underline"
          >
            {login.forgotPassword}
          </a>
        </div>

        {/* Login */}
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full bg-[#f5f2eb] text-xs text-[#399b7b] hover:bg-white font-bold"
        >
          {form.formState.isSubmitting ? "Loading..." : "Login"}
          <FaAngleRight size={15} />
        </Button>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <Separator className="flex-1 bg-white/15" />

          <span className="text-xs text-white/45">or</span>

          <Separator className="flex-1 bg-white/15" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full border-white/15 bg-[#162f3b] text-white hover:bg-[#1c3946]"
          onClick={() => {
            window.location.href = "http://localhost:3000/api/v1/auth/google";
          }}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full  text-xs font-bold">
            <Icon size={20} />
          </span>
          {login.google.text}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
