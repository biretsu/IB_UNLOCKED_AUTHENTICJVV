"use client";

import Link from "next/link";
import { GraduationCap, Compass, BookOpen, MessageSquare, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Navigator", href: "/planned", icon: Compass },
  { name: "Career Quiz", href: "/undecided", icon: GraduationCap },
  { name: "Universities", href: "/universities", icon: BookOpen },
  { name: "AI Advisor", href: "/advisor", icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
          <div className="bg-primary text-primary-foreground p-1 rounded">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          IB Unlocked
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent",
                pathname === item.href ? "text-accent" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
           <Link href="/planned" className="hidden sm:inline-flex bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-sm">
            Start Planning
           </Link>
        </div>
      </div>
    </nav>
  );
}
