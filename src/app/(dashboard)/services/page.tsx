// FILE: src/app/(dashboard)/services/page.tsx
import { DataTable } from "@/components/data-table";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { createServerApiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "./components/service-form";

async function getServices(tenantId: string) {
    const api = createServerApiClient();
    const { data, error } = await api.GET("/tenants/{tenantId}/services", {
        params: {
            path: { tenantId }
        }
    });

    if (error) {
        console.error("Failed to fetch services", error);
        return [];
    }

    return data || [];
}


export default async function ServicesPage() {
  const session = await getSession();
  if (!session?.tenantId) {
    // Handle case where user may not be associated with a tenant
    return redirect("/");
  }

  const data = await getServices(session.tenantId);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <ServiceForm />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
