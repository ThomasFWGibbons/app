// FILE: src/app/(dashboard)/services/actions.ts
"use server";

import { createServerApiClient } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { ServiceSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createService(values: z.infer<typeof ServiceSchema>) {
    const session = await getSession();
    if (!session?.tenantId) {
        return { error: "Not authenticated or no tenant associated" };
    }

    const validatedFields = ServiceSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const api = createServerApiClient();
    const { data, error } = await api.POST("/tenants/{tenantId}/services", {
        params: { path: { tenantId: session.tenantId } },
        body: validatedFields.data,
    });

    if (error) {
        return { error: (error as any).message || "Failed to create service." };
    }

    revalidatePath("/services");
    return { data };
}
