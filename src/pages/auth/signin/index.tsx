import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import UserAuthForm from "../components/user-auth-form";
import { Music2 } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        to="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 hidden md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r  lg:flex">
        <div className="absolute inset-0 bg-primary dark:bg-secondary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Music2 />
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Digite seu usuário e senha para entrar.
            </p>
          </div>
          <UserAuthForm isLogin={true} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Não possui conta?{" "}
            {/* <Link
              to="/cadastrar"
              className="underline underline-offset-4 hover:text-primary"
            >
              Cadastre-se
            </Link> */}
            <Link
              to="/home"
              className="underline underline-offset-4 hover:text-primary"
            >
              Escalas
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
