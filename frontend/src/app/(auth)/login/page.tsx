import AuthCard from "@/components/auth/auth-card";

const LoginPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 max-md:p-0">
      <AuthCard initialTab="login" />
    </main>
  );
};

export default LoginPage;
