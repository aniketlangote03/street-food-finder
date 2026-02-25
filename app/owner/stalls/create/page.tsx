"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";

export default function CreateStallPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await fetch("/api/owner/stalls/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || "Failed to create stall");
        return;
      }

      window.location.href = "/owner/stalls";
    });
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Create New Stall</h1>

      {message && (
        <div className="text-red-600 mb-3">{message}</div>
      )}

      <form action={onSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" required />
        </div>

        <div>
          <Label>Description</Label>
          <Input name="description" />
        </div>

        <div>
          <Label>Cuisine Type</Label>
          <Input name="cuisine_type" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Opening Time</Label>
            <Input name="opening_time" placeholder="10:00" />
          </div>

          <div>
            <Label>Closing Time</Label>
            <Input name="closing_time" placeholder="22:00" />
          </div>
        </div>

        <div>
          <Label>Location Description</Label>
          <Input name="location_description" />
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700" disabled={isPending}>
          {isPending ? "Creating..." : "Create Stall"}
        </Button>
      </form>
    </div>
  );
}
