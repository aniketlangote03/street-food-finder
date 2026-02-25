"use client"

import { useState, useTransition } from "react"
import { signIn } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function LoginPage() {
  const [state, setState] = useState<{ success: boolean; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await signIn(formData)
      setState(res)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Icons.logo className="mx-auto h-10 w-10 text-orange-500" />
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.message && <p className="text-sm font-medium text-destructive">{state.message}</p>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/login" className="text-center">
                Admin Login
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/owner/login" className="text-center">
                Owner Login
              </Link>
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
