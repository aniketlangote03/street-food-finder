"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function OwnerLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const search = useSearchParams();

  const signupSuccess = search?.get("message") === "signup_success";

  async function onSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/owner-login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data?.message || "Invalid login credentials.");
        return;
      }

      window.location.href = "/owner/dashboard";
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <Icons.logo className="mx-auto h-10 w-10 text-orange-500" />
          <CardTitle className="text-2xl">Stall Owner Login</CardTitle>
          <CardDescription>Enter your stall owner credentials to manage your stall.</CardDescription>
        </CardHeader>
        <CardContent>
          {signupSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Account created. Please log in.
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="owner@example.com" />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-green-600 hover:bg-green-700">
              {isPending ? "Logging in..." : "Login as Owner"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/owner/signup" className="underline hover:text-green-600">
              Create Owner Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
