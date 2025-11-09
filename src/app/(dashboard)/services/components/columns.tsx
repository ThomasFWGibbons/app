// FILE: src/app/(dashboard)/services/components/columns.tsx
"use client"

import { components } from "@/lib/api-schema";
import { ColumnDef } from "@tanstack/react-table"

export type Service = components["schemas"]["ServiceRes"];

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "duration_minutes",
    header: "Duration (min)",
  },
  {
    accessorKey: "price_cents",
    header: "Price",
    cell: ({ row }) => {
        const price = parseFloat(row.getValue("price_cents")) || 0;
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD", // Should come from tenant settings
        }).format(price / 100);
        return <div className="font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (row.getValue("active") ? "Active" : "Inactive"),
  },
]
