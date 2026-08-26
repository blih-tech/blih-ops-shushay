"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Spinner, Badge } from "@/components/ui";
import { Users, LogOut, LogIn, UserPlus } from "lucide-react";

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-muted px-4 py-16">
      <Card className="max-w-xl w-full text-center">
        <CardHeader className="p-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Users className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl">Blih Talent</CardTitle>
          <CardDescription className="text-base">
            Connecting trained remote-ready talents with European companies.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-2">
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground py-4">
              <Spinner size="sm" />
              <span>Checking session status...</span>
            </div>
          ) : user ? (
            <div className="space-y-6">
              <div className="p-3 bg-muted rounded-lg inline-flex items-center gap-2">
                <span className="text-sm text-body">Signed in as <strong className="text-foreground">{user.email}</strong></span>
                <Badge variant="primary">{user.role}</Badge>
              </div>
              <div className="flex justify-center gap-4">
                <Link href={user.role === "COMPANY" ? "/company" : "/profile"}>
                  <Button variant="primary">Go to Portal</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 pt-2">
              <a
                href={`${AUTH_URL}/login?returnTo=${encodeURIComponent(
                  window.location.origin + "/profile"
                )}`}
              >
                <Button
                  variant="primary"
                  leftIcon={<LogIn className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              </a>
              <a href={`${AUTH_URL}/register`}>
                <Button
                  variant="outline"
                  leftIcon={<UserPlus className="h-4 w-4" />}
                >
                  Register
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
