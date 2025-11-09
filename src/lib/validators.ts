// FILE: src/lib/validators.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  tenant_slug: z.string().optional(),
});

export const ServiceSchema = z.object({
    name: z.string().min(1, "Service name is required."),
    type: z.enum(["appointment", "rental", "service"]),
    duration_minutes: z.coerce.number().int().positive().optional().nullable(),
    price_cents: z.coerce.number().int().positive().optional().nullable(),
    capacity: z.coerce.number().int().positive().optional().nullable(),
});
