"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Icons.logo className="mx-auto h-10 w-10 text-orange-500" />
          <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with your authentication. This could be due to an expired or invalid link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Possible reasons:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>The verification link has expired</li>
              <li>The link has already been used</li>
              <li>There was a network error</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Try Logging In Again</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/signup">Create New Account</Link>
            </Button>
          </div>

          <div className="text-center">
            <Button variant="link" asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
