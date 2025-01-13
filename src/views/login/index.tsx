import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSign } from "@/api/stsytem";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/footer";

const LoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  roomName: z.string().min(1, { message: "roomName is required" }),
});

const Login: React.FC = () => {
  const navicate = useNavigate();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      roomName: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const res = await getSign(data);
    if (res.code === 0) {
      window.sessionStorage.setItem("sign", res.data);
      navicate("/room");
    }
  };
  return (
    <div className="h-screen flex justify-center items-center bg-sky-500">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle>
            <div className="w-full flex-col gap-y-4 flex items-center justify-center">
              <h1 className="text-3xl font-semibold">📹 Livekit</h1>
              <p className=" text-muted-foreground text-sm">welcome to back</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>roomName</FormLabel>
                    <FormControl>
                      <Input placeholder="roomName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Join
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export default Login;
