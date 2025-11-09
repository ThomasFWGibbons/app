// FILE: src/app/(dashboard)/services/components/service-form.tsx
"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceSchema } from "@/lib/validators";
import { z } from "zod";
import { createService } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type ServiceFormData = z.infer<typeof ServiceSchema>;

export function ServiceForm() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ServiceFormData>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: {
            type: "appointment"
        }
    });

    const onSubmit = async (data: ServiceFormData) => {
        const result = await createService(data);
        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: "Service created successfully."
            });
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Service</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Service</DialogTitle>
                    <DialogDescription>
                        Add a new service to your business. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" {...register("name")} className="col-span-3" />
                            {errors.name && <p className="text-sm text-red-500 col-span-4">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                             <Label htmlFor="type" className="text-right">Type</Label>
                             {/* Select for type */}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration_minutes" className="text-right">Duration (min)</Label>
                            <Input id="duration_minutes" type="number" {...register("duration_minutes")} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price_cents" className="text-right">Price (cents)</Label>
                            <Input id="price_cents" type="number" {...register("price_cents")} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
