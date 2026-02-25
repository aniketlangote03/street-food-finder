import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function EditStallPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: stall } = await supabase
    .from("stalls")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!stall) return <div className="p-6">Stall not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Stall</h1>

      <form
        action={`/api/owner/stalls/${stall.id}/edit`}
        method="POST"
        className="space-y-4"
      >
        <div>
          <Label>Name</Label>
          <Input name="name" defaultValue={stall.name} required />
        </div>

        <div>
          <Label>Description</Label>
          <Input name="description" defaultValue={stall.description} />
        </div>

        <div>
          <Label>Cuisine Type</Label>
          <Input name="cuisine_type" defaultValue={stall.cuisine_type} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Opening Time</Label>
            <Input name="opening_time" defaultValue={stall.opening_time} />
          </div>

          <div>
            <Label>Closing Time</Label>
            <Input name="closing_time" defaultValue={stall.closing_time} />
          </div>
        </div>

        <div>
          <Label>Location Description</Label>
          <Input
            name="location_description"
            defaultValue={stall.location_description}
          />
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
