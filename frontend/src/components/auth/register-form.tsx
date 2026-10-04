"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaAngleRight } from "react-icons/fa6";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import {
  type RegisterFormValues,
  registerUserSchema,
} from "@/lib/validation/auth";
import { useRegisterMutation } from "@/hooks/queries/use-auth-query";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      mobileNo: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutateAsync: registerMutation, isPending } = useRegisterMutation();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerMutation(data);

      toast.success("Registration successful");
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

  const register = AuthSectionData.register;
  const Icon = register.google.icon;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        {/* Full Name */}
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="registration-fullName"
                className="text-white/70"
              >
                {register.fullName.label}
              </FieldLabel>

              <Input
                {...field}
                id="registration-fullName"
                placeholder={register.fullName.placeholder}
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                className="h-11 border-white/15 bg-[#142d38] text-white placeholder:text-white/35 focus-visible:border-[#72d2ad] focus-visible:ring-[#72d2ad]/20"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Username */}
        <Controller
          name="userName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="registration-username"
                className="text-white/70"
              >
                {register.username.label}
              </FieldLabel>

              <Input
                {...field}
                id="registration-username"
                placeholder={register.username.placeholder}
                autoComplete="username"
                aria-invalid={fieldState.invalid}
                className="h-11 border-white/15 bg-[#142d38] text-white placeholder:text-white/35 focus-visible:border-[#72d2ad] focus-visible:ring-[#72d2ad]/20"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Mobile */}
        <Controller
          name="mobileNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="registration-mobileNo"
                className="text-white/70"
              >
                {register.mobile.label}
              </FieldLabel>

              <Input
                {...field}
                id="registration-mobileNo"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder={register.mobile.placeholder}
                autoComplete="tel"
                aria-invalid={fieldState.invalid}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  field.onChange(value);
                }}
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
              <FieldLabel
                htmlFor="registration-password"
                className="text-white/70"
              >
                {register.password.label}
              </FieldLabel>

              <div className="relative">
                <Input
                  {...field}
                  id="registration-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={register.password.placeholder}
                  autoComplete="new-password"
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

        {/* Register */}
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full bg-[#f5f2eb] font-bold text-xs text-[#399b7b] hover:bg-white"
        >
          {form.formState.isSubmitting
            ? "Creating account..."
            : "Create account"}

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
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
            <Icon size={20} />
          </span>
          {register.google.text}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
