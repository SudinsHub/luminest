"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { User, OptionIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function AdminHeader() {
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const navigation = [
  { name: "Dashboard", href: "/313admins"},
  { name: "Products", href: "/313admins/products"},
  { name: "Orders", href: "/313admins/orders"},
  { name: "Customers", href: "/313admins/customers"},
  { name: "Categories", href: "/313admins/categories"},
  { name: "Coupons", href: "/313admins/coupons"},
  { name: "Carousel", href: "/313admins/carousel" },
  { name: "Analytics", href: "/313admins/analytics" },
  { name: "Tag Management", href: "/313admins/tags" },
  { name: "Settings", href: "/313admins/settings"},
  { name: "Return to Shop", href: "/"},
]
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <span className="text-sm text-muted-foreground">{(user as any)?.email}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isMobile &&
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <OptionIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {navigation.map((item) => (
              <DropdownMenuItem key={item.name}>
                <a href={item.href}>{item.name}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </header>
  )
}
