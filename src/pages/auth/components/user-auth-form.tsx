import { Error } from "@/components/shared/error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Digite seu usuário"),
  password: z.string().min(1, "Digite sua senha"),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm({ isLogin }: { isLogin: boolean }) {
  const { login, signup, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    if (!isLogin) {
      signup(data.username, data.password);
      return;
    }

    login(data.username, data.password);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Usuário..."
                    disabled={isLoading}
                    className="h-12 pr-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Senha..."
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="h-12 pr-5"
                      {...field}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <Error message={error} />}

          <Button
            disabled={isLoading}
            className="ml-auto w-full h-12"
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Entrando..." : "Cadastrando..."}
              </>
            ) : (
              <>{isLogin ? "Entrar" : "Cadastrar"}</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
