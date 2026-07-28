import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await requireUser();
  if (!user || user.id === "demo-user") {
    return NextResponse.json(
      { error: "A connected workspace is required." },
      { status: user ? 503 : 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organization_id");
  const query = (searchParams.get("q") || "").slice(0, 100);
  const limit = Math.min(Number(searchParams.get("limit")) || 25, 100);

  if (!organizationId) {
    return NextResponse.json(
      { error: "organization_id is required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  let requestQuery = supabase
    .from("contacts")
    .select("id, first_name, last_name, email, title, status, company:companies(id, name)")
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (query) {
    const safeQuery = query.replace(/[%_,()]/g, "");
    requestQuery = requestQuery.or(
      `first_name.ilike.%${safeQuery}%,last_name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%`,
    );
  }

  const { data, error } = await requestQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user || user.id === "demo-user") {
    return NextResponse.json(
      { error: "A connected workspace is required." },
      { status: user ? 503 : 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const organizationId =
    typeof body.organization_id === "string" ? body.organization_id : "";
  const firstName = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

  if (!organizationId || !firstName || !lastName) {
    return NextResponse.json(
      { error: "organization_id, first_name, and last_name are required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      organization_id: organizationId,
      first_name: firstName.slice(0, 100),
      last_name: lastName.slice(0, 100),
      email: email?.slice(0, 320),
      title: typeof body.title === "string" ? body.title.slice(0, 160) : null,
      created_by: user.id,
    })
    .select("id, first_name, last_name, email, title, status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
