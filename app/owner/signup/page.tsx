"use client";

import { useState, useTransition } from "react";
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

export default function OwnerSignupPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/owner-signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data?.message || "Failed to sign up. Please try again.");
        return;
      }

      window.location.href = "/owner/login?message=signup_success";
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <Icons.logo className="mx-auto h-10 w-10 text-green-600" />
          <CardTitle className="text-2xl">Create Stall Owner Account</CardTitle>
          <CardDescription>
            Sign up to manage your stalls and menus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-left">
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
              <Label htmlFor="display_name">Name</Label>
              <Input
                id="display_name"
                name="display_name"
                type="text"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="owner@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Owner Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/owner/login"
              className="underline hover:text-green-600"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
