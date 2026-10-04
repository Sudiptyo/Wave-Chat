"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserQuery } from "@/hooks/queries/use-user-query";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();

  const { data: user, isLoading, isError } = useUserQuery();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return null;
  }

  if (isError || !user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
