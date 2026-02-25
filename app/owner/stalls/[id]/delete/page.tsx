import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function DeleteStallPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: stall } = await supabase
    .from("stalls")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!stall) return <div className="p-6">Stall not found.</div>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Delete Stall "{stall.name}"
      </h1>

      <p className="mb-4 text-gray-700">
        Are you sure you want to delete this stall? This action cannot be undone.
      </p>

      <form action={`/api/owner/stalls/${stall.id}/delete`} method="POST">
        <Button className="bg-red-600 hover:bg-red-700 w-full">
          Yes, Delete Stall
        </Button>
      </form>
    </div>
  );
}
