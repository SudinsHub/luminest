import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import localFont from "next/font/local"



const centuryGothic = localFont({
  src: [
    {
      path: "../public/fonts/Century Gothic W05 Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Century Gothic Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-century",
})

export const metadata = {
  title: "Luminest - Brightening Your Everyday",
  description: "Premium ceramic goods for modern living",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${centuryGothic.variable}`}>
      <body className="font-century antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
