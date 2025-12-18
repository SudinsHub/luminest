"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Ticket,
  ImageIcon,
  Settings,
  BarChart3, Tags
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/313admins", icon: LayoutDashboard },
  { name: "Products", href: "/313admins/products", icon: Package },
  { name: "Orders", href: "/313admins/orders", icon: ShoppingCart },
  { name: "Customers", href: "/313admins/customers", icon: Users },
  { name: "Categories", href: "/313admins/categories", icon: Tag },
  { name: "Coupons", href: "/313admins/coupons", icon: Ticket },
  { name: "Carousel", href: "/313admins/carousel", icon: ImageIcon },
  { name: "Analytics", href: "/313admins/analytics", icon: BarChart3 },
  { name: "Tag Management", href: "/313admins/tags", icon: Tags },
  { name: "Settings", href: "/313admins/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/313admins" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-secondary" />
          <span className="text-xl font-bold">Luminest Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          ← Back to Store
        </Link>
      </div>
    </div>
  )
}
