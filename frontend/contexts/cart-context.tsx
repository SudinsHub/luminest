"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api/axios"
import type { CartItem } from "@/lib/types"
import { useAuth } from "./auth-context"

interface CartContextType {
  cart: CartItem[]
  isLoading: boolean
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, userRole } = useAuth()

  const refreshCart = async () => {
    if (user && userRole === "customer") {
      try {
        setIsLoading(true)
        const response = await api.get("/customer/cart")
        setCart(response.data)
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setCart([])
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user, userRole])

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await api.post("/customer/cart/add", { productId, quantity })
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      await api.put(`/customer/cart/update/${itemId}`, { quantity })
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/customer/cart/remove/${itemId}`)
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await api.delete("/customer/cart/clear")
      setCart([])
    } catch (error) {
      throw error
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
