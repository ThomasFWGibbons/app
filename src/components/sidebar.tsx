// FILE: src/components/sidebar.tsx
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, List, Calendar, Users, Settings } from "lucide-react";

const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/services", label: "Services", icon: List },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/staff", label: "Staff", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-background border-r p-4 hidden md:block">
            <div className="mb-8 font-bold text-lg">My Business</div>
            <nav>
                <ul>
                    {navItems.map(item => (
                        <li key={item.href}>
                            <Link href={item.href} className={cn(
                                "flex items-center p-2 rounded-md hover:bg-accent",
                                pathname === item.href && "bg-accent"
                            )}>
                                <item.icon className="mr-2 h-4 w-4"/>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
