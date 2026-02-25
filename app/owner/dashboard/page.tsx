"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Store,
  Menu,
  MessageSquare,
  IndianRupee,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AddStallDialog } from "@/components/owner/add-stall-dialog";
import { motion } from "framer-motion";

export default function OwnerDashboardPage() {
  const [stalls, setStalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/owner/stalls");
        if (!res.ok) {
          console.error("Failed to load owner stalls", res.status);
          setError("Failed to load your stalls.");
          return;
        }
        const data = await res.json();
        setStalls(data || []);
      } catch (e) {
        console.error("Error loading owner stalls", e);
        setError("Failed to load your stalls.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  const totalStalls = stalls.length;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between space-y-2"
      >
        <h2 className="text-4xl font-heading font-bold tracking-tight text-gray-900">
          Manage Your Stall with Ease
        </h2>
      </motion.div>

      <Separator className="my-6 bg-cyan-200/50" />

      {/* Get Started */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-morphism border-cyan-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-500" /> Get Started
            </CardTitle>
            <CardDescription>Quick steps to set up your stall</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span>Create your first stall</span>
                </div>

                <AddStallDialog>
                  <button className="px-3 py-1 text-sm rounded-md border bg-white hover:bg-gray-50">
                    Add Stall
                  </button>
                </AddStallDialog>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Add menu items with prices and photos</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Set opening & closing hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="glass-morphism border-cyan-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-500" /> Tips
            </CardTitle>
            <CardDescription>
              Improve your stall visibility
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Keep your status updated to “Open”.</li>
              <li>Add high-quality photos.</li>
              <li>Encourage customers to leave reviews.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-morphism border-cyan-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-cyan-500" /> Total Stalls
            </CardTitle>
            <CardDescription>Your active stalls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStalls}</div>
          </CardContent>
        </Card>

        {/* Placeholder stats */}
        <Card className="glass-morphism border-cyan-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5 text-cyan-500" /> Active Menus
            </CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-cyan-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyan-500" /> Pending Reviews
            </CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-cyan-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-cyan-500" /> Revenue
            </CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rs 0.00</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
